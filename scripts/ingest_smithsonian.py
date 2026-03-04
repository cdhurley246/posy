#!/usr/bin/env python3
"""
Smithsonian Open Access → Posy Supabase Ingestion Script
=========================================================
Fetches records from the Smithsonian Open Access S3 dataset and upserts
them into the Posy `images` table in Supabase.

Usage:
  python3 scripts/ingest_smithsonian.py           # Test: 50 records
  python3 scripts/ingest_smithsonian.py --full    # Full Freer Gallery ingest

Requirements: Python 3.7+ (stdlib only, no pip installs needed)

Notes:
  - Only records with at least one image URL are ingested.
  - Re-running is safe if you have a UNIQUE constraint on source_id.
    To add it in Supabase SQL editor:
      ALTER TABLE images ADD CONSTRAINT images_source_id_key UNIQUE (source_id);
  - The anon key is used here. If RLS blocks writes, swap in your service
    role key (Settings → API → service_role in the Supabase dashboard).
"""

import json
import os
import sys
import urllib.request
import urllib.error
from datetime import datetime, timezone

# ── Config ──────────────────────────────────────────────────────────────────

SUPABASE_URL = "https://ogyfmotdvxwdskbyudky.supabase.co"

# The anon key is public-safe but cannot bypass Row Level Security.
# Ingestion (INSERT) requires the service role key.
#
# Get it from: Supabase Dashboard → Project Settings → API → service_role key
# Then set it in your shell before running:
#   export SUPABASE_SERVICE_KEY="eyJ..."
#   python3 scripts/ingest_smithsonian.py
#
_ANON_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    ".eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9neWZtb3Rkdnh3ZHNrYnl1ZGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0OTE4MzgsImV4cCI6MjA4ODA2NzgzOH0"
    ".kXbgNkWQRu27uvGZs8QrOJ_OAM330SNydjR2UoooX4g"
)
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY") or _ANON_KEY
_USING_SERVICE_KEY = bool(os.environ.get("SUPABASE_SERVICE_KEY"))

SOURCE_INSTITUTION = "Smithsonian — Freer Gallery"

# Freer Gallery index on S3
FSG_INDEX_URL = (
    "https://smithsonian-open-access.s3-us-west-2.amazonaws.com"
    "/metadata/edan/fsg/index.txt"
)

# How many records to process in test mode
TEST_BATCH_SIZE = 50

# How many rows to send to Supabase per API call (stay under payload limits)
INSERT_CHUNK_SIZE = 25


# ── Smithsonian field extraction ─────────────────────────────────────────────

def first_freetext(freetext: dict, field: str, key: str = "content"):
    """Return the first `key` value from a freetext array field, or None."""
    items = freetext.get(field, [])
    for item in items:
        val = item.get(key)
        if val:
            return val
    return None


def first_freetext_where(freetext: dict, field: str, label: str, key: str = "content"):
    """Return the first value where label matches, e.g. physicalDescription/Medium."""
    for item in freetext.get(field, []):
        if item.get("label") == label:
            val = item.get(key)
            if val:
                return val
    return None


def extract_image_url(dnr: dict):
    """
    Pull the first image content URL from online_media.
    Prefers the delivery-service URL (content) over thumbnail.
    """
    media_block = dnr.get("online_media", {})
    for item in media_block.get("media", []):
        if item.get("type") == "Images":
            return item.get("content") or item.get("thumbnail")
    return None


def map_record(raw: dict):
    """
    Map a raw Smithsonian EDAN record to a Posy `images` row.
    Returns None if no image URL is found (record should be skipped).
    """
    content = raw.get("content", {})
    dnr = content.get("descriptiveNonRepeating", {})
    freetext = content.get("freetext", {})
    indexed = content.get("indexedStructured", {})

    # ── Image URL (required) ──
    image_url = extract_image_url(dnr)
    if not image_url:
        return None

    # ── Title ──
    title = dnr.get("title", {}).get("content") or raw.get("title")

    # ── Source identifiers ──
    source_id = dnr.get("record_ID") or raw.get("id")
    source_url = dnr.get("record_link")

    # ── Date ──
    date_created = first_freetext(freetext, "date")

    # ── Medium ──
    medium = first_freetext_where(freetext, "physicalDescription", "Medium")

    # ── Culture / Region ──
    # Combine structured culture tags and freetext place of origin
    cultures = indexed.get("culture", [])
    places = [p.get("content", "") for p in freetext.get("place", []) if p.get("content")]
    combined = []
    seen = set()
    for val in cultures + places:
        if val and val not in seen:
            combined.append(val)
            seen.add(val)
    culture_region = ", ".join(combined) if combined else None

    # ── License ──
    rights_items = freetext.get("objectRights", [])
    license_val = rights_items[0].get("content") if rights_items else None
    if not license_val:
        license_val = dnr.get("metadata_usage", {}).get("access")

    # ── Category ──
    obj_types = freetext.get("objectType", [])
    source_category = obj_types[0].get("content") if obj_types else None
    if not source_category:
        ot = indexed.get("object_type", [])
        source_category = ot[0] if ot else None

    return {
        "title": title,
        "source_institution": SOURCE_INSTITUTION,
        "source_id": source_id,
        "source_url": source_url,
        "image_url": image_url,
        "date_created": date_created,
        "medium": medium,
        "culture_region": culture_region,
        "license": license_val,
        "source_category": source_category,
        "raw_metadata": raw,  # stored as jsonb
    }


# ── HTTP helpers ─────────────────────────────────────────────────────────────

def fetch_text(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "Posy-Ingest/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8")


def supabase_insert(rows: list, upsert: bool = False):
    """
    Insert (or upsert) a batch of rows into Supabase via the REST API.

    Plain INSERT is used by default. Pass upsert=True only after you've
    added a UNIQUE constraint on source_id:
      ALTER TABLE images ADD CONSTRAINT images_source_id_key UNIQUE (source_id);
    """
    if upsert:
        endpoint = f"{SUPABASE_URL}/rest/v1/images?on_conflict=source_id"
        prefer = "return=minimal,resolution=merge-duplicates"
    else:
        endpoint = f"{SUPABASE_URL}/rest/v1/images"
        prefer = "return=minimal"

    payload = json.dumps(rows).encode("utf-8")

    req = urllib.request.Request(
        endpoint,
        data=payload,
        method="POST",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": prefer,
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            status = resp.status
            if status not in (200, 201):
                body = resp.read().decode()
                raise RuntimeError(f"Supabase returned {status}: {body}")
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        raise RuntimeError(f"Supabase HTTP {e.code}: {body}") from e


# ── Core pipeline ─────────────────────────────────────────────────────────────

def stream_fsg_records(file_urls: list[str], max_records: int):
    """
    Generator: yields raw dicts parsed from Freer Gallery S3 data files.
    Stops after `max_records` records have been yielded.
    """
    yielded = 0
    for file_url in file_urls:
        if yielded >= max_records:
            break
        try:
            text = fetch_text(file_url)
        except Exception as e:
            print(f"\n  [warn] Could not fetch {file_url}: {e}", file=sys.stderr)
            continue

        for line in text.splitlines():
            if yielded >= max_records:
                break
            line = line.strip()
            if not line:
                continue
            try:
                record = json.loads(line)
            except json.JSONDecodeError:
                continue
            yield record
            yielded += 1


def run(full: bool = False, upsert: bool = False):
    max_records = float("inf") if full else TEST_BATCH_SIZE
    mode_label = "FULL INGEST" if full else f"TEST ({TEST_BATCH_SIZE} records)"

    print(f"\n{'='*55}")
    print(f"  Posy × Smithsonian Ingestion  [{mode_label}]")
    print(f"{'='*55}")
    print(f"  Institution : {SOURCE_INSTITUTION}")
    print(f"  Started at  : {datetime.now(timezone.utc).isoformat()}")
    if not _USING_SERVICE_KEY:
        print()
        print("  ⚠  SUPABASE_SERVICE_KEY not set — using anon key.")
        print("     Inserts will likely fail due to Row Level Security.")
        print("     Get your service role key from:")
        print("     Supabase Dashboard → Settings → API → service_role")
        print("     Then run:  export SUPABASE_SERVICE_KEY='eyJ...'")
    print()

    # 1. Fetch the Freer Gallery file index
    print("Fetching Freer Gallery index from S3...")
    index_text = fetch_text(FSG_INDEX_URL)
    file_urls = [u.strip() for u in index_text.splitlines() if u.strip()]
    print(f"  Found {len(file_urls)} data files.\n")

    # 2. Stream, map, and batch-insert
    processed = 0
    ingested = 0
    skipped_no_image = 0
    buffer = []

    for raw in stream_fsg_records(file_urls, max_records):
        processed += 1
        mapped = map_record(raw)

        if mapped is None:
            skipped_no_image += 1
            continue

        buffer.append(mapped)

        if len(buffer) >= INSERT_CHUNK_SIZE:
            supabase_insert(buffer, upsert=upsert)
            ingested += len(buffer)
            buffer = []
            print(
                f"  \r  Ingested: {ingested:>4}  |  "
                f"Skipped (no image): {skipped_no_image:>3}  |  "
                f"Processed: {processed:>4}",
                end="",
                flush=True,
            )

    # Flush remainder
    if buffer:
        supabase_insert(buffer, upsert=upsert)
        ingested += len(buffer)
        buffer = []

    print(f"\r  Ingested: {ingested:>4}  |  "
          f"Skipped (no image): {skipped_no_image:>3}  |  "
          f"Processed: {processed:>4}")

    print(f"\n{'='*55}")
    print(f"  Done!")
    print(f"  Processed : {processed}")
    print(f"  Ingested  : {ingested}")
    print(f"  Skipped   : {skipped_no_image}  (no image URL)")
    print(f"  Finished  : {datetime.now(timezone.utc).isoformat()}")
    print(f"{'='*55}\n")


# ── Entrypoint ────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    full_run = "--full" in sys.argv
    upsert_mode = "--upsert" in sys.argv
    run(full=full_run, upsert=upsert_mode)

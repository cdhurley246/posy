export const config = { runtime: "edge" };

const CONTEXT_SYSTEM = `You are a brilliant cultural guide with deep knowledge of art history, material culture, and human stories.
Given metadata about a museum object, write 2-3 sentences of vivid, surprising context — like whispering something genuinely interesting to a friend standing in front of it.
One specific, unexpected detail that makes the world feel bigger. Never dry, never generic, no clichés.
Respond with ONLY the context sentences, nothing else.`;

// ── Art Institute of Chicago ──────────────────────────────────────────────────

const AIC_DEPARTMENTS = [
  "Applied Arts of Europe", "Architecture and Design", "Asian Art",
  "Arts of Africa", "Arts of the Ancient Mediterranean and Byzantium",
  "Arts of the Americas", "European Painting and Sculpture before 1900",
  "Modern Art", "Photography and Media", "Prints and Drawings", "Textiles",
];

async function fetchAIC() {
  const dept = AIC_DEPARTMENTS[Math.floor(Math.random() * AIC_DEPARTMENTS.length)];
  const page = Math.floor(Math.random() * 80) + 1;
  const url = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(dept)}&query[term][is_public_domain]=true&fields=id,title,artist_display,date_display,place_of_origin,medium_display,image_id,department_title,artwork_type_title&limit=20&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`AIC ${res.status}`);
  const data = await res.json();
  const items = (data.data || []).filter(o => o.image_id);
  if (!items.length) throw new Error("AIC no results");
  const obj = items[Math.floor(Math.random() * items.length)];
  return {
    title: obj.title || "Untitled",
    artist: obj.artist_display || "",
    date: obj.date_display || "",
    origin: obj.place_of_origin || "",
    medium: obj.medium_display || obj.artwork_type_title || "",
    collection: "Art Institute of Chicago",
    department: obj.department_title || dept,
    imageUrl: `https://www.artic.edu/iiif/2/${obj.image_id}/full/843,/0/default.jpg`,
    sourceUrl: `https://www.artic.edu/artworks/${obj.id}`,
  };
}

// ── Rijksmuseum ───────────────────────────────────────────────────────────────

const RIJKS_TYPES = [
  "painting", "print", "drawing", "textile", "ceramic",
  "sculpture", "furniture", "jewellery", "glass",
];

async function fetchRijks() {
  const type = RIJKS_TYPES[Math.floor(Math.random() * RIJKS_TYPES.length)];
  const page = Math.floor(Math.random() * 30) + 1;
  const url = `https://www.rijksmuseum.nl/api/en/collection?key=0fiuZFh4&type=${type}&imgonly=True&ps=10&p=${page}&s=relevance`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Rijks ${res.status}`);
  const data = await res.json();
  const items = (data.artObjects || []).filter(o => o.webImage?.url);
  if (!items.length) throw new Error("Rijks no results");
  const obj = items[Math.floor(Math.random() * items.length)];
  const imageUrl = obj.webImage.url.replace(/=s\d+$/, "=s1200");
  return {
    title: obj.title || "Untitled",
    artist: obj.principalOrFirstMaker || "",
    date: obj.dating?.presentingDate || "",
    origin: "Netherlands",
    medium: type,
    collection: "Rijksmuseum, Amsterdam",
    department: type,
    imageUrl,
    sourceUrl: `https://www.rijksmuseum.nl/en/collection/${obj.objectNumber}`,
  };
}

// ── Met Museum ────────────────────────────────────────────────────────────────

const MET_DEPARTMENTS = [11, 12, 13, 14, 15, 16, 17, 18, 19, 21];

async function fetchMet() {
  const deptId = MET_DEPARTMENTS[Math.floor(Math.random() * MET_DEPARTMENTS.length)];
  const searchRes = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${deptId}&isPublicDomain=true`);
  if (!searchRes.ok) throw new Error(`Met search ${searchRes.status}`);
  const searchData = await searchRes.json();
  const ids = searchData.objectIDs || [];
  if (!ids.length) throw new Error("Met no IDs");
  const randomId = ids[Math.floor(Math.random() * Math.min(ids.length, 1000))];
  const objRes = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomId}`);
  if (!objRes.ok) throw new Error(`Met object ${objRes.status}`);
  const obj = await objRes.json();
  if (!obj.primaryImageSmall) throw new Error("Met no image");
  return {
    title: obj.title || "Untitled",
    artist: obj.artistDisplayName || obj.culture || "",
    date: obj.objectDate || "",
    origin: obj.country || obj.culture || "",
    medium: obj.medium || obj.classification || "",
    collection: "The Metropolitan Museum of Art",
    department: obj.department || "",
    imageUrl: obj.primaryImageSmall,
    sourceUrl: obj.objectURL || "",
  };
}

// ── Smithsonian (Supabase) ────────────────────────────────────────────────────

const SUPABASE_URL = "https://ogyfmotdvxwdskbyudky.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
  ".eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9neWZtb3Rkdnh3ZHNrYnl1ZGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0OTE4MzgsImV4cCI6MjA4ODA2NzgzOH0" +
  ".kXbgNkWQRu27uvGZs8QrOJ_OAM330SNydjR2UoooX4g";

async function fetchSupabase() {
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  };

  // 1. Get total row count so we can pick a truly random offset
  const countRes = await fetch(`${SUPABASE_URL}/rest/v1/images?select=id`, {
    headers: { ...headers, Prefer: "count=exact", "Range-Unit": "items", Range: "0-0" },
  });
  if (!countRes.ok) throw new Error(`Supabase count ${countRes.status}`);
  const contentRange = countRes.headers.get("Content-Range") || "";   // "0-0/4719"
  const total = parseInt(contentRange.split("/")[1]) || 4719;

  // 2. Fetch one random row
  const offset = Math.floor(Math.random() * total);
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/images?select=*&limit=1&offset=${offset}`,
    { headers },
  );
  if (!res.ok) throw new Error(`Supabase fetch ${res.status}`);
  const rows = await res.json();
  if (!rows.length) throw new Error("Supabase: no rows (check RLS SELECT policy)");

  const row = rows[0];
  if (!row.image_url) throw new Error("Supabase: row has no image_url");

  return {
    title:      row.title || "Untitled",
    artist:     "",                          // creator not stored as a dedicated column
    date:       row.date_created || "",
    origin:     row.culture_region || "",
    medium:     row.medium || "",
    collection: row.source_institution || "",
    department: row.source_category || "",
    imageUrl:   row.image_url,
    sourceUrl:  row.source_url || "",
  };
}

// ── Filtered Supabase query ───────────────────────────────────────────────────

const CULTURE_PATTERNS = {
  france: "*France*",
  italy:  "*Italy*",
  usa:    "*USA*",
  china:  "*China*",
  japan:  "*Japan*",
  europe: "*Europe*",
};

async function fetchSupabaseFiltered({ source, era, culture } = {}) {
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  };

  // Build PostgREST filter clauses as raw query-string segments
  const parts = [];

  if (source === "smithsonian") parts.push("source_institution=ilike.*Smithsonian*");
  if (source === "bhl")         parts.push("source_institution=ilike.*Biodiversity*");

  // Era: best-effort text comparison — works for pure-year strings (e.g. "1727"),
  // also works for range-start strings like "1771–1802" due to lexicographic ordering.
  if (era === "before-1500") { parts.push("date_created=lt.1500"); }
  if (era === "1500-1800")   { parts.push("date_created=gte.1500"); parts.push("date_created=lt.1800"); }
  if (era === "1800-1900")   { parts.push("date_created=gte.1800"); parts.push("date_created=lt.1900"); }
  if (era === "1900-1950")   { parts.push("date_created=gte.1900"); parts.push("date_created=lt.1950"); }
  if (era === "after-1950")  { parts.push("date_created=gte.1950"); }

  if (culture && CULTURE_PATTERNS[culture]) {
    // PostgREST ilike: column=ilike.*Pattern* — the * is the glob wildcard
    parts.push(`culture_region=ilike.${CULTURE_PATTERNS[culture]}`);
  }

  const qs = parts.length ? `&${parts.join("&")}` : "";

  // 1. Count matching rows for random-offset selection
  const countRes = await fetch(
    `${SUPABASE_URL}/rest/v1/images?select=id${qs}`,
    { headers: { ...headers, Prefer: "count=exact", "Range-Unit": "items", Range: "0-0" } },
  );
  if (!countRes.ok) throw new Error(`Supabase filter count ${countRes.status}`);
  const cr    = countRes.headers.get("Content-Range") || "";
  const total = parseInt(cr.split("/")[1]) || 0;
  if (total === 0) throw new Error("EMPTY_FILTER");

  // 2. Fetch one random row within the filtered set
  const offset = Math.floor(Math.random() * total);
  const rowRes = await fetch(
    `${SUPABASE_URL}/rest/v1/images?select=*${qs}&limit=1&offset=${offset}`,
    { headers },
  );
  if (!rowRes.ok) throw new Error(`Supabase filtered fetch ${rowRes.status}`);
  const rows = await rowRes.json();
  if (!rows.length || !rows[0].image_url) throw new Error("EMPTY_FILTER");

  const row = rows[0];
  return {
    title:      row.title || "Untitled",
    artist:     "",
    date:       row.date_created || "",
    origin:     row.culture_region || "",
    medium:     row.medium || "",
    collection: row.source_institution || "",
    department: row.source_category || "",
    imageUrl:   row.image_url,
    sourceUrl:  row.source_url || "",
  };
}

// ── Library of Congress ───────────────────────────────────────────────────────

const LOC_COLLECTIONS = [
  { slug: "works-progress-administration-posters", label: "WPA Posters",             maxPages: 38 },
  { slug: "world-war-i-posters",                   label: "World War I Posters",     maxPages: 75 },
  { slug: "yanker-posters",                        label: "Yanker Poster Collection", maxPages: 47 },
];

async function fetchLOC() {
  const coll = LOC_COLLECTIONS[Math.floor(Math.random() * LOC_COLLECTIONS.length)];
  const page = Math.floor(Math.random() * coll.maxPages) + 1;
  const url = `https://www.loc.gov/collections/${coll.slug}/?fo=json&c=25&sp=${page}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`LOC ${res.status}`);
  const data = await res.json();

  const results = (data.results || []).filter(r => (r.image_url || []).length > 0);
  if (!results.length) throw new Error("LOC: no items with images on this page");

  const obj = results[Math.floor(Math.random() * results.length)];

  // Take the largest image (last entry), strip the #h=...&w=... fragment.
  // If we only got a _150px thumbnail, upgrade to the medium-res r.jpg (~640px).
  let imageUrl = obj.image_url[obj.image_url.length - 1].split("#")[0];
  if (imageUrl.includes("_150px.")) {
    imageUrl = imageUrl.replace(/_150px\.[^.]+$/, "r.jpg");
  }

  // contributor is an array of creator strings
  const artist = Array.isArray(obj.contributor)
    ? obj.contributor[0] || ""
    : (obj.contributor || "");

  // date is an ISO string like "1941-01-01" — show just the year
  const date = obj.date ? obj.date.slice(0, 4) : "";

  const medium = Array.isArray(obj.original_format)
    ? obj.original_format[0]
    : (obj.original_format || "poster");

  return {
    title:      (typeof obj.title === "string" ? obj.title : (obj.title || []).join("")) || "Untitled",
    artist,
    date,
    origin:     "United States",
    medium,
    collection: "Library of Congress",
    department: coll.label,
    imageUrl,
    sourceUrl:  typeof obj.id === "string" ? obj.id : "",
  };
}

// ── Europeana (Finnish collections) ──────────────────────────────────────────

async function fetchEuropeana() {
  const EUROPEANA_KEY = process.env.EUROPEANA_API_KEY || "api2demo";
  const params = new URLSearchParams({
    wskey: EUROPEANA_KEY,
    query: "*",
    reusability: "open",
    sort: "random",
    rows: "20",
    profile: "rich",
  });
  params.append("qf", "COUNTRY:finland");
  params.append("qf", "TYPE:IMAGE");

  const res = await fetch(`https://api.europeana.eu/record/v2/search.json?${params}`);
  if (!res.ok) throw new Error(`Europeana ${res.status}`);
  const data = await res.json();

  const first = (arr) => (Array.isArray(arr) && arr.length > 0) ? arr[0] : "";
  const items = (data.items || []).filter(item => first(item.edmIsShownBy));
  if (!items.length) throw new Error("Europeana: no items with images");

  const obj = items[Math.floor(Math.random() * items.length)];
  return {
    title:      first(obj.title) || "Untitled",
    artist:     first(obj.dcCreator) || "",
    date:       first(obj.year) || "",
    origin:     "Finland",
    medium:     first(obj.dcFormat) || first(obj.dcType) || "",
    collection: first(obj.dataProvider) || "Europeana",
    department: first(obj.dataProvider) || "",
    imageUrl:   first(obj.edmIsShownBy),
    sourceUrl:  first(obj.edmIsShownAt) || obj.guid || "",
  };
}

// ── Fetch with retries ────────────────────────────────────────────────────────

const FETCHERS = [fetchAIC, fetchAIC, fetchRijks, fetchMet, fetchSupabase, fetchSupabase, fetchEuropeana, fetchEuropeana, fetchLOC, fetchLOC];

async function fetchMuseumObject() {
  const shuffled = [...FETCHERS].sort(() => Math.random() - 0.5);
  for (const fetcher of shuffled) {
    try {
      return await fetcher();
    } catch (e) {
      console.error("Fetcher failed:", e.message);
    }
  }
  throw new Error("All fetchers failed");
}

// ── Handler ───────────────────────────────────────────────────────────────────

// Maps source param values to their live-API fetcher functions
const LIVE_FETCHERS = {
  met:       fetchMet,
  rijks:     fetchRijks,
  aic:       fetchAIC,
  europeana: fetchEuropeana,
  loc:       fetchLOC,
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const withContext = searchParams.get("context") === "true";
  const source      = searchParams.get("source")  || null;   // "smithsonian" | "met" | "rijks" | …
  const era         = searchParams.get("era")     || null;   // "1800-1900" | "after-1950" | …
  const culture     = searchParams.get("culture") || null;   // "france" | "japan" | …

  let artwork;
  try {
    if (LIVE_FETCHERS[source]) {
      // Route directly to the named live-API fetcher (era/culture ignored for live sources)
      artwork = await LIVE_FETCHERS[source]();
    } else if (source === "smithsonian" || source === "bhl" || era || culture) {
      // One or more DB-level filters active — query Supabase with WHERE clauses
      artwork = await fetchSupabaseFiltered({ source, era, culture });
    } else {
      // No filters — current random multi-source behaviour
      artwork = await fetchMuseumObject();
    }
  } catch (e) {
    if (e.message === "EMPTY_FILTER") {
      return new Response(JSON.stringify({ empty: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: e.message }), { status: 502 });
  }

  let context = "";
  if (withContext) {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system: CONTEXT_SYSTEM,
        messages: [{
          role: "user",
          content: `Title: ${artwork.title}\nArtist/maker: ${artwork.artist}\nDate: ${artwork.date}\nOrigin: ${artwork.origin}\nMedium: ${artwork.medium}\nCollection: ${artwork.collection}\n\nWrite vivid, surprising context for this object.`,
        }],
      }),
    });
    const anthropicData = await anthropicRes.json();
    context = anthropicData.content?.[0]?.text?.trim() || "";
  }

  return new Response(JSON.stringify({ ...artwork, context }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

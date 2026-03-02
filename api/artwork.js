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
  const url = `https://www.rijksmuseum.nl/api/en/collection?key=${process.env.RIJKSMUSEUM_API_KEY}&type=${type}&imgonly=True&ps=10&p=${page}&s=relevance`;
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

// ── Fetch with retries ────────────────────────────────────────────────────────

const FETCHERS = [fetchAIC, fetchAIC, fetchRijks, fetchMet];

async function fetchMuseumObject() {
  const shuffled = [...FETCHERS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
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

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const withContext = searchParams.get("context") === "true";

  let artwork;
  try {
    artwork = await fetchMuseumObject();
  } catch (e) {
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
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        system: CONTEXT_SYSTEM,
        messages: [{
          role: "user",
          content: `Title: ${artwork.title}\nArtist/maker: ${artwork.artist}\nDate: ${artwork.date}\nOrigin: ${artwork.origin}\nMedium: ${artwork.medium}\nCollection: ${artwork.collection}\n\nWrite vivid, surprising context for this object.`,
        }],
      }),
    });
    if (!anthropicRes.ok) {
      console.error("Anthropic error:", anthropicRes.status, await anthropicRes.text());
    } else {
      const anthropicData = await anthropicRes.json();
      context = anthropicData.content?.[0]?.text?.trim() || "";
    }
  }

  return new Response(JSON.stringify({ ...artwork, context }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

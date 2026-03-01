export const config = { runtime: "edge" };

const DEPARTMENTS = [
  "Applied Arts of Europe",
  "Architecture and Design",
  "Asian Art",
  "Arts of Africa",
  "Arts of the Ancient Mediterranean and Byzantium",
  "Arts of the Americas",
  "European Painting and Sculpture before 1900",
  "Modern Art",
  "Photography and Media",
  "Prints and Drawings",
  "Textiles",
];

const CONTEXT_SYSTEM = `You are a brilliant cultural guide with deep knowledge of art history, material culture, and human stories.
Given metadata about a museum object, write 2-3 sentences of vivid, surprising context — like whispering something genuinely interesting to a friend standing in front of it.
One specific, unexpected detail that makes the world feel bigger. Never dry, never generic, no clichés.
Respond with ONLY the context sentences, nothing else.`;

export default async function handler(req) {
  const dept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
  const page = Math.floor(Math.random() * 80) + 1;
  const aicUrl = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(dept)}&query[term][is_public_domain]=true&fields=id,title,artist_display,date_display,place_of_origin,medium_display,image_id,department_title,artwork_type_title&limit=20&page=${page}`;

  const aicRes = await fetch(aicUrl);
  if (!aicRes.ok) {
    return new Response(JSON.stringify({ error: "AIC API failed" }), { status: 502 });
  }
  const aicData = await aicRes.json();
  const items = (aicData.data || []).filter(o => o.image_id);
  if (!items.length) {
    return new Response(JSON.stringify({ error: "No results" }), { status: 404 });
  }

  const obj = items[Math.floor(Math.random() * items.length)];
  const imageUrl = `https://www.artic.edu/iiif/2/${obj.image_id}/full/843,/0/default.jpg`;

  const artwork = {
    title: obj.title || "Untitled",
    artist: obj.artist_display || "Unknown",
    date: obj.date_display || "",
    origin: obj.place_of_origin || "",
    medium: obj.medium_display || obj.artwork_type_title || "",
    collection: "Art Institute of Chicago",
    department: obj.department_title || dept,
    imageUrl,
    sourceUrl: `https://www.artic.edu/artworks/${obj.id}`,
  };

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
        content: `Title: ${artwork.title}\nArtist/maker: ${artwork.artist}\nDate: ${artwork.date}\nOrigin: ${artwork.origin}\nMedium: ${artwork.medium}\nDepartment: ${artwork.department}\n\nWrite vivid, surprising context for this object.`,
      }],
    }),
  });

  const anthropicData = await anthropicRes.json();
  const context = anthropicData.content?.[0]?.text?.trim() || "";

  return new Response(JSON.stringify({ ...artwork, context }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

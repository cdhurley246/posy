export const config = { runtime: "edge" };

const CONTEXT_SYSTEM = `You are a brilliant cultural guide with deep knowledge of art history, material culture, and human stories.
Given metadata about a museum object, write 2-3 sentences of vivid, surprising context — like whispering something genuinely interesting to a friend standing in front of it.
One specific, unexpected detail that makes the world feel bigger. Never dry, never generic, no clichés.
Respond with ONLY the context sentences, nothing else.`;

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  let artwork;
  try {
    artwork = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const { title, artist, date, origin, medium, collection } = artwork;
  if (!title && !artist) {
    return new Response(JSON.stringify({ error: "Missing artwork fields" }), { status: 400 });
  }

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
    const errText = await anthropicRes.text();
    console.error("Anthropic error:", anthropicRes.status, errText);
    return new Response(JSON.stringify({ error: "Context generation failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await anthropicRes.json();
  const context = data.content?.[0]?.text?.trim() || "";

  return new Response(JSON.stringify({ context }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

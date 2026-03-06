export const config = { runtime: "edge" };

const CONTEXT_SYSTEM = `You are a brilliant cultural guide with deep knowledge of art history, material culture, and human stories.
Given metadata about a museum object, write 2-3 sentences of vivid, surprising context — like whispering something genuinely interesting to a friend standing in front of it.
One specific, unexpected detail that makes the world feel bigger. Never dry, never generic, no clichés.
Respond with ONLY the context sentences, nothing else.`;

const QUESTION_SYSTEM = `You are a brilliant cultural guide with deep knowledge of art history, material culture, and human stories.
The user is standing in front of a museum object and has just read a short piece of context about it. Now they have a specific question.
Answer in 2-4 sentences — vividly and personally, as if whispering to a curious friend in a gallery.
Be specific. If you don't know something with confidence, say so honestly rather than inventing.
Respond with ONLY the answer, nothing else.`;

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const { title, artist, date, origin, medium, collection, context, question } = body;

  let system, userMessage, maxTokens;

  if (question) {
    system = QUESTION_SYSTEM;
    maxTokens = 400;
    const meta = [
      `Title: ${title}`,
      artist ? `Artist/maker: ${artist}` : null,
      date   ? `Date: ${date}`           : null,
      origin ? `Origin: ${origin}`       : null,
      medium ? `Medium: ${medium}`       : null,
      `Collection: ${collection}`,
    ].filter(Boolean).join("\n");
    const prior = context ? `\nContext already shown to the user:\n${context}\n` : "";
    userMessage = `${meta}${prior}\nUser's question: ${question}`;
  } else {
    system = CONTEXT_SYSTEM;
    maxTokens = 300;
    userMessage = `Title: ${title}\nArtist/maker: ${artist}\nDate: ${date}\nOrigin: ${origin}\nMedium: ${medium}\nCollection: ${collection}\n\nWrite vivid, surprising context for this object.`;
  }

  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  const data = await anthropicRes.json();
  const text = data.content?.[0]?.text?.trim() || "";

  return new Response(
    JSON.stringify(question ? { answer: text } : { context: text }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

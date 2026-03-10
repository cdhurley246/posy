export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const { message } = await req.json();
  if (!message?.trim()) {
    return new Response(JSON.stringify({ error: 'No message' }), { status: 400 });
  }

  const response = await fetch('https://formspree.io/f/meerarnn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    return new Response(JSON.stringify({ error: 'Failed to send' }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}

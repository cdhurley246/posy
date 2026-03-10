import { Resend } from 'resend';

export const config = { runtime: 'edge' };

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { message } = body;
  if (!message?.trim()) {
    return new Response(JSON.stringify({ error: 'No message' }), { status: 400 });
  }

  await resend.emails.send({
    from: 'Posy Feedback <feedback@yourdomain.com>', // update with real domain
    to: 'your@email.com',                            // update with your email
    subject: 'Posy feedback',
    text: message,
  });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}

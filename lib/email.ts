import { Resend } from 'resend';

export function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

type SendArgs = { to: string; subject: string; html: string; replyTo?: string };

export async function sendEmail({ to, subject, html, replyTo }: SendArgs) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn('[email] RESEND_API_KEY missing, email skipped');
    return { ok: false };
  }
  const resend = new Resend(key);
  const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';
  const { error } = await resend.emails.send({ from, to, subject, html, replyTo });
  if (error) console.error('[email]', error);
  return { ok: !error };
}

const DEFAULT_BOOK_CALL_WEBHOOK_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://taskmaster-jfw0.onrender.com/api/webhooks/book-call'
    : 'http://127.0.0.1:5000/api/webhooks/book-call';

export function resolveBookCallWebhookUrl(): string {
  const configured = (process.env.TASKMASTER_WEBHOOK_URL || process.env.CRM_WEBHOOK_URL || '').trim();
  return configured || DEFAULT_BOOK_CALL_WEBHOOK_URL;
}

export async function forwardBookCallToTaskmaster(
  payload: Record<string, unknown>
): Promise<{ ok: boolean; status: number; body: unknown }> {
  const url = resolveBookCallWebhookUrl();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const secret = process.env.BOOK_CALL_WEBHOOK_SECRET;
  if (secret) headers['X-Webhook-Secret'] = secret;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

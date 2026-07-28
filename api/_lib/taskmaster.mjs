import crypto from 'crypto';

const LOCAL_TASKMASTER_HOST = 'http://127.0.0.1:5000';
const PRODUCTION_TASKMASTER_HOST = 'https://taskmaster-jfw0.onrender.com';

export function resolveTaskmasterBaseUrl() {
  const configured = (process.env.TASKMASTER_API_URL || process.env.TASKMASTER_BASE_URL || '').trim();
  if (configured) return configured.replace(/\/$/, '');
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
    return PRODUCTION_TASKMASTER_HOST;
  }
  return LOCAL_TASKMASTER_HOST;
}

export function resolveWebhookUrl(envKey, defaultPath) {
  const configured = (process.env[envKey] || '').trim();
  if (configured) return configured;
  return `${resolveTaskmasterBaseUrl()}${defaultPath}`;
}

export function computeWebhookSignature(rawBody, secret) {
  return `sha256=${crypto.createHmac('sha256', secret).update(rawBody).digest('hex')}`;
}

export async function forwardToTaskmaster({ url, secret, payload }) {
  const body = JSON.stringify(payload);
  const headers = { 'Content-Type': 'application/json' };
  if (secret) {
    headers['X-Webhook-Secret'] = secret;
    headers['X-Webhook-Signature'] = computeWebhookSignature(body, secret);
  }
  const res = await fetch(url, { method: 'POST', headers, body });
  const parsed = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body: parsed };
}

export function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8') || '{}';
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

export function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

export function normalizeIndiaPhone(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  if (String(value).trim().startsWith('+')) return String(value).trim();
  return digits;
}

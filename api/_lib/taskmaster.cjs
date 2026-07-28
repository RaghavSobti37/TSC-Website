const crypto = require('crypto');

const LOCAL_TASKMASTER_HOST = 'http://127.0.0.1:5000';
const PRODUCTION_TASKMASTER_HOST = 'https://taskmaster-jfw0.onrender.com';

function resolveTaskmasterBaseUrl() {
  const configured = (process.env.TASKMASTER_API_URL || process.env.TASKMASTER_BASE_URL || '').trim();
  if (configured) return configured.replace(/\/$/, '');
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
    return PRODUCTION_TASKMASTER_HOST;
  }
  return LOCAL_TASKMASTER_HOST;
}

function resolveWebhookUrl(envKey, defaultPath) {
  const configured = (process.env[envKey] || '').trim();
  if (configured) return configured;
  return `${resolveTaskmasterBaseUrl()}${defaultPath}`;
}

function computeWebhookSignature(rawBody, secret) {
  return `sha256=${crypto.createHmac('sha256', secret).update(rawBody).digest('hex')}`;
}

async function forwardToTaskmaster({ url, secret, payload }) {
  const body = JSON.stringify(payload);
  const headers = { 'Content-Type': 'application/json' };
  if (secret) {
    headers['X-Webhook-Secret'] = secret;
    headers['X-Webhook-Signature'] = computeWebhookSignature(body, secret);
  }
  let lastErr;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body,
        signal: AbortSignal.timeout(55000),
      });
      const parsed = await res.json().catch(() => ({}));
      return { ok: res.ok, status: res.status, body: parsed };
    } catch (err) {
      lastErr = err;
      if (attempt === 1) await new Promise((r) => setTimeout(r, 1500));
    }
  }
  throw lastErr;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === 'object') {
      resolve(req.body);
      return;
    }
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

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(data));
}

function normalizeIndiaPhone(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  if (String(value).trim().startsWith('+')) return String(value).trim();
  return digits;
}

function trim(value) {
  return String(value ?? '').trim();
}

module.exports = {
  resolveTaskmasterBaseUrl,
  resolveWebhookUrl,
  forwardToTaskmaster,
  readJsonBody,
  sendJson,
  normalizeIndiaPhone,
  trim,
  PRODUCTION_TASKMASTER_HOST,
};


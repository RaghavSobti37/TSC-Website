/**
 * Newsletter subscriber store: a "Newsletter Subscribers" tab in the TSC forms
 * Google Sheet, written with the website's service account (JWT + Sheets REST,
 * no SDK). One row per email; re-subscribing updates nothing and is reported as
 * already subscribed.
 *
 * Env: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, TSC_FORMS_SHEET_ID
 *      (optional NEWSLETTER_SHEET_TAB to rename the tab).
 */
const crypto = require('crypto');

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SHEETS_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';
const HEADERS = ['Email', 'Name', 'Source', 'Source Site', 'Subscribed At', 'Status', 'Legacy ID', 'Added At'];

let cachedToken = null;
let cachedTokenExp = 0;
let tabReady = false;

// Env UIs often flatten the PEM (spaces or literal "\n" instead of line breaks).
// Rebuild a well-formed PEM from whatever arrives.
function normalizePem(raw) {
  const text = String(raw || '').trim().replace(/^"|"$/g, '').replace(/\\n/g, '\n');
  const m = text.match(/-----BEGIN ([A-Z ]+)-----([\s\S]*?)-----END \1-----/);
  if (!m) return text;
  const body = m[2].replace(/\s+/g, '');
  return '-----BEGIN ' + m[1] + '-----\n' + body.match(/.{1,64}/g).join('\n') + '\n-----END ' + m[1] + '-----\n';
}

function config() {
  const clientEmail = (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '').trim();
  const privateKey = normalizePem(process.env.GOOGLE_PRIVATE_KEY);
  const sheetId = (process.env.TSC_FORMS_SHEET_ID || '').trim();
  const tab = (process.env.NEWSLETTER_SHEET_TAB || 'Newsletter Subscribers').trim();
  if (!clientEmail || !privateKey || !sheetId) return null;
  return { clientEmail, privateKey, sheetId, tab };
}

function isConfigured() {
  return Boolean(config());
}

async function accessToken(cfg) {
  if (cachedToken && Date.now() < cachedTokenExp - 60000) return cachedToken;
  const now = Math.floor(Date.now() / 1000);
  const enc = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const unsigned = enc({ alg: 'RS256', typ: 'JWT' }) + '.' + enc({
    iss: cfg.clientEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  });
  const signature = crypto.createSign('RSA-SHA256').update(unsigned).sign(cfg.privateKey).toString('base64url');
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: unsigned + '.' + signature,
    }),
    signal: AbortSignal.timeout(15000),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.access_token) throw new Error('Google auth failed (' + res.status + ')');
  cachedToken = body.access_token;
  cachedTokenExp = Date.now() + (body.expires_in || 3600) * 1000;
  return cachedToken;
}

async function sheets(cfg, path, options = {}) {
  const token = await accessToken(cfg);
  const res = await fetch(SHEETS_BASE + '/' + encodeURIComponent(cfg.sheetId) + path, {
    ...options,
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json', ...(options.headers || {}) },
    signal: AbortSignal.timeout(20000),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error('Sheets API ' + res.status + ': ' + ((body.error && body.error.message) || 'request failed'));
  return body;
}

function range(cfg, a1) {
  return encodeURIComponent("'" + cfg.tab.replace(/'/g, "''") + "'!" + a1);
}

async function ensureTab(cfg) {
  if (tabReady) return;
  const meta = await sheets(cfg, '?fields=sheets.properties.title');
  const exists = (meta.sheets || []).some((s) => s.properties && s.properties.title === cfg.tab);
  if (!exists) {
    await sheets(cfg, ':batchUpdate', {
      method: 'POST',
      body: JSON.stringify({ requests: [{ addSheet: { properties: { title: cfg.tab, gridProperties: { frozenRowCount: 1 } } } }] }),
    });
  }
  const head = await sheets(cfg, '/values/' + range(cfg, 'A1:H1'));
  if (!head.values || !head.values[0] || head.values[0][0] !== 'Email') {
    await sheets(cfg, '/values/' + range(cfg, 'A1:H1') + '?valueInputOption=RAW', {
      method: 'PUT',
      body: JSON.stringify({ values: [HEADERS] }),
    });
  }
  tabReady = true;
}

async function existingEmails(cfg) {
  const col = await sheets(cfg, '/values/' + range(cfg, 'A2:A'));
  return new Set((col.values || []).map((r) => String(r[0] || '').trim().toLowerCase()).filter(Boolean));
}

function toRow(s) {
  return [
    s.email,
    s.name || '',
    s.source || '',
    s.sourceSite || '',
    s.subscribedAt || new Date().toISOString(),
    s.unsubscribed ? 'unsubscribed' : 'subscribed',
    s.legacyId || '',
    new Date().toISOString(),
  ];
}

/** Add subscribers that are not already in the sheet. Returns { added, skipped }. */
async function addSubscribers(list) {
  const cfg = config();
  if (!cfg) throw new Error('Newsletter store is not configured');
  await ensureTab(cfg);
  const seen = await existingEmails(cfg);
  const rows = [];
  for (const s of list) {
    const email = String(s.email || '').trim().toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    rows.push(toRow({ ...s, email }));
  }
  if (rows.length) {
    await sheets(cfg, '/values/' + range(cfg, 'A:H') + ':append?valueInputOption=RAW&insertDataOption=INSERT_ROWS', {
      method: 'POST',
      body: JSON.stringify({ values: rows }),
    });
  }
  return { added: rows.length, skipped: list.length - rows.length };
}

module.exports = { isConfigured, addSubscribers };

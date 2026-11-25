/**
 * Admin authentication for /admin.
 *
 * - Password is checked against ADMIN_PASSWORD_HASH ("scrypt$<salt b64>$<hash b64>"),
 *   generated with scripts/admin-password-hash.cjs. The plain password is never stored.
 * - Sessions are a signed, expiring cookie (HMAC-SHA256 with ADMIN_SESSION_SECRET):
 *   HttpOnly, Secure on https, SameSite=Strict, scoped to /api/admin.
 * - State-changing requests must come from this site (Origin check) and carry the
 *   X-TSC-Admin header, on top of SameSite=Strict.
 */
const crypto = require('crypto');

const COOKIE = 'tsc_admin';
const SESSION_SECONDS = 8 * 60 * 60;
const failures = new Map(); // best-effort per-instance throttle: ip -> { count, until }

function secret() {
  const s = (process.env.ADMIN_SESSION_SECRET || '').trim();
  return s.length >= 32 ? s : null;
}

function isConfigured() {
  return Boolean(secret() && (process.env.ADMIN_PASSWORD_HASH || '').trim().startsWith('scrypt$'));
}

function verifyPassword(password) {
  const parts = (process.env.ADMIN_PASSWORD_HASH || '').trim().split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const salt = Buffer.from(parts[1], 'base64');
  const expected = Buffer.from(parts[2], 'base64');
  const actual = crypto.scryptSync(String(password || ''), salt, expected.length, { N: 16384, r: 8, p: 1 });
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function sign(payload) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
}

function issueCookie(req) {
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS, n: crypto.randomBytes(8).toString('hex') })).toString('base64url');
  const value = payload + '.' + sign(payload);
  return cookieHeader(req, value, SESSION_SECONDS);
}

function clearCookie(req) {
  return cookieHeader(req, '', 0);
}

function cookieHeader(req, value, maxAge) {
  const secure = isHttps(req) ? '; Secure' : '';
  return `${COOKIE}=${value}; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

function isHttps(req) {
  const proto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
  return proto === 'https' || (req.socket && req.socket.encrypted);
}

function readCookie(req) {
  const header = req.headers.cookie || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === COOKIE) return v.join('=');
  }
  return '';
}

function isAuthenticated(req) {
  if (!secret()) return false;
  const value = readCookie(req);
  const dot = value.lastIndexOf('.');
  if (dot < 1) return false;
  const payload = value.slice(0, dot);
  const given = Buffer.from(value.slice(dot + 1));
  const expected = Buffer.from(sign(payload));
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return typeof data.exp === 'number' && data.exp > Math.floor(Date.now() / 1000);
  } catch (e) {
    return false;
  }
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  try {
    return new URL(origin).host === String(req.headers['x-forwarded-host'] || req.headers.host || '');
  } catch (e) {
    return false;
  }
}

/** For POST/PATCH/DELETE: same-site origin plus the custom header. */
function isTrustedWrite(req) {
  return sameOrigin(req) && req.headers['x-tsc-admin'] === '1';
}

function clientIp(req) {
  return String(req.headers['x-forwarded-for'] || (req.socket && req.socket.remoteAddress) || '').split(',')[0].trim();
}

function throttled(req) {
  const entry = failures.get(clientIp(req));
  return Boolean(entry && entry.until > Date.now());
}

function recordFailure(req) {
  const ip = clientIp(req);
  const entry = failures.get(ip) || { count: 0, until: 0 };
  entry.count += 1;
  if (entry.count >= 5) entry.until = Date.now() + Math.min(15 * 60 * 1000, 30000 * 2 ** (entry.count - 5));
  failures.set(ip, entry);
}

function clearFailures(req) {
  failures.delete(clientIp(req));
}

function noStore(res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
}

// Admin responses: no CORS headers (same-origin only), never cached.
function json(res, status, data) {
  noStore(res);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

function readBody(req, limit = 10000) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => { raw += c; if (raw.length > limit) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(raw || '{}')); } catch (e) { resolve({}); } });
    req.on('error', () => resolve({}));
  });
}

module.exports = {
  isConfigured,
  verifyPassword,
  issueCookie,
  clearCookie,
  isAuthenticated,
  isTrustedWrite,
  throttled,
  recordFailure,
  clearFailures,
  noStore,
  json,
  readBody,
};

const auth = require('../_lib/adminAuth.cjs');

module.exports = async function adminLogin(req, res) {
  if (req.method !== 'POST') return auth.json(res, 405, { error: 'Method not allowed' });
  if (!auth.isConfigured()) return auth.json(res, 503, { error: 'Admin access is not configured' });
  if (!auth.isTrustedWrite(req)) return auth.json(res, 403, { error: 'Forbidden' });
  if (auth.throttled(req)) return auth.json(res, 429, { error: 'Too many attempts. Try again later.' });
  const body = await auth.readBody(req);
  const ok = typeof body.password === 'string' && body.password.length <= 200 && auth.verifyPassword(body.password);
  if (!ok) {
    auth.recordFailure(req);
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return auth.json(res, 401, { error: 'Incorrect password' });
  }
  auth.clearFailures(req);
  res.setHeader('Set-Cookie', auth.issueCookie(req));
  return auth.json(res, 200, { ok: true });
};

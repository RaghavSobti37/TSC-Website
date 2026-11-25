const auth = require('../_lib/adminAuth.cjs');

module.exports = async function adminLogout(req, res) {
  if (req.method !== 'POST') return auth.json(res, 405, { error: 'Method not allowed' });
  if (!auth.isTrustedWrite(req)) return auth.json(res, 403, { error: 'Forbidden' });
  res.setHeader('Set-Cookie', auth.clearCookie(req));
  return auth.json(res, 200, { ok: true });
};

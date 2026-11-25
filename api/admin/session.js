const auth = require('../_lib/adminAuth.cjs');

module.exports = async function adminSession(req, res) {
  if (req.method !== 'GET') return auth.json(res, 405, { error: 'Method not allowed' });
  return auth.json(res, 200, { authenticated: auth.isAuthenticated(req), configured: auth.isConfigured() });
};

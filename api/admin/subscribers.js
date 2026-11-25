const auth = require('../_lib/adminAuth.cjs');
const db = require('../_lib/newsletterDb.cjs');

function csvCell(value) {
  let s = value == null ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // block spreadsheet formula injection
  return '"' + s.replace(/"/g, '""') + '"';
}

module.exports = async function adminSubscribers(req, res) {
  if (!auth.isAuthenticated(req)) return auth.json(res, 401, { error: 'Not signed in' });
  if (!db.isConfigured()) return auth.json(res, 503, { error: 'Newsletter database is not configured' });
  const url = new URL(req.url, 'http://local');
  try {
    if (req.method === 'GET') {
      const q = url.searchParams.get('q') || '';
      const status = url.searchParams.get('status') || 'all';
      if (url.searchParams.get('format') === 'csv') {
        const rows = await db.exportAll({ q, status });
        const header = ['email', 'name', 'source', 'source_site', 'subscribed_at', 'status'];
        const lines = [header.join(',')].concat(rows.map((r) => [
          r.email, r.name, r.source, r.sourceSite,
          r.subscribedAt ? new Date(r.subscribedAt).toISOString() : '',
          r.unsubscribed ? 'unsubscribed' : 'subscribed',
        ].map(csvCell).join(',')));
        auth.noStore(res);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="tsc-newsletter-subscribers.csv"');
        return res.end('\uFEFF' + lines.join('\r\n'));
      }
      const data = await db.list({ q, status, page: url.searchParams.get('page'), pageSize: url.searchParams.get('pageSize') });
      return auth.json(res, 200, data);
    }
    if (req.method === 'PATCH') {
      if (!auth.isTrustedWrite(req)) return auth.json(res, 403, { error: 'Forbidden' });
      const body = await auth.readBody(req);
      if (typeof body.id !== 'string' || typeof body.unsubscribed !== 'boolean') return auth.json(res, 400, { error: 'Bad request' });
      const ok = await db.setUnsubscribed(body.id, body.unsubscribed);
      return auth.json(res, ok ? 200 : 404, ok ? { ok: true } : { error: 'Not found' });
    }
    return auth.json(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    console.error('[admin/subscribers]', err && err.message);
    return auth.json(res, 500, { error: 'Something went wrong' });
  }
};

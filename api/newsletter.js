const {
  forwardToTaskmaster,
  resolveWebhookUrl,
  readJsonBody,
  sendJson,
} = require('./_lib/taskmaster.cjs');

module.exports = async function newsletter(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, error: 'Method not allowed' });
  }
  try {
    const body = typeof req.body === 'object' && req.body ? req.body : await readJsonBody(req);
    const email = String(body.email || '').trim();
    if (!email) return sendJson(res, 400, { success: false, error: 'Email is required' });

    const { ok, status, body: tm } = await forwardToTaskmaster({
      url: resolveWebhookUrl('TASKMASTER_NEWSLETTER_WEBHOOK_URL', '/api/webhooks/newsletter'),
      secret: process.env.NEWSLETTER_WEBHOOK_SECRET,
      payload: {
        email,
        source: 'tsc-footer',
        sourceSite: 'tsc-website',
        subscribedAt: new Date().toISOString(),
      },
    });

    if (!ok) {
      return sendJson(res, status >= 400 && status < 600 ? status : 502, {
        success: false,
        error: (tm && tm.error) || `Newsletter sync failed (${status})`,
      });
    }
    return sendJson(res, 200, { success: true, message: 'Successfully subscribed' });
  } catch (err) {
    console.error('[newsletter]', err.message || err);
    return sendJson(res, 500, { success: false, error: 'We could not subscribe you right now. Please try again.' });
  }
};

const {
  forwardToTaskmaster,
  resolveWebhookUrl,
  readJsonBody,
  sendJson,
} = require('./_lib/taskmaster.cjs');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async function newsletter(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { success: false, error: 'Method not allowed' });
  }
  try {
    const body = typeof req.body === 'object' && req.body ? req.body : await readJsonBody(req);
    const email = String(body.email || '').trim().toLowerCase();
    if (!email) {
      return sendJson(res, 400, { success: false, error: 'Email address is required' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return sendJson(res, 400, { success: false, error: 'Please enter a valid email address (e.g. name@domain.com)' });
    }

    const { ok, status, body: tm } = await forwardToTaskmaster({
      url: resolveWebhookUrl('TASKMASTER_NEWSLETTER_WEBHOOK_URL', '/api/webhooks/newsletter'),
      secret: process.env.NEWSLETTER_WEBHOOK_SECRET,
      payload: {
        email,
        fromEmail: 'helloworld@theshakticollective.in',
        sendConfirmationEmail: true,
        source: body.source || 'tsc-footer',
        sourceSite: 'tsc-website',
        subscribedAt: new Date().toISOString(),
      },
    });

    if (!ok) {
      return sendJson(res, status >= 400 && status < 600 ? status : 502, {
        success: false,
        error: (tm && tm.error) || `Newsletter subscription failed (${status})`,
      });
    }
    return sendJson(res, 200, { success: true, message: 'Welcome to the TSC Family!' });
  } catch (err) {
    console.error('[newsletter]', err.message || err);
    return sendJson(res, 500, { success: false, error: 'We could not subscribe you right now. Please try again.' });
  }
};

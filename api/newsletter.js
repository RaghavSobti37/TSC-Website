const {
  forwardToTaskmaster,
  resolveWebhookUrl,
  readJsonBody,
  sendJson,
} = require('./_lib/taskmaster.cjs');
const db = require('./_lib/newsletterDb.cjs');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Taskmaster only sends the confirmation email / CRM contact now; never let it
// hold up or fail a signup that is already saved.
const TASKMASTER_NOTIFY_TIMEOUT_MS = 6000;

function taskmasterPayload(email, source) {
  return {
    email,
    fromEmail: 'helloworld@theshakticollective.in',
    sendConfirmationEmail: true,
    source,
    sourceSite: 'tsc-website',
    subscribedAt: new Date().toISOString(),
  };
}

function notifyTaskmaster(email, source) {
  const call = forwardToTaskmaster({
    url: resolveWebhookUrl('TASKMASTER_NEWSLETTER_WEBHOOK_URL', '/api/webhooks/newsletter'),
    secret: process.env.NEWSLETTER_WEBHOOK_SECRET,
    payload: taskmasterPayload(email, source),
  }).catch((err) => ({ ok: false, status: 0, error: err }));
  const timeout = new Promise((resolve) => setTimeout(() => resolve({ ok: false, status: 0, timedOut: true }), TASKMASTER_NOTIFY_TIMEOUT_MS));
  return Promise.race([call, timeout]);
}

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
    if (!EMAIL_REGEX.test(email) || email.length > 254) {
      return sendJson(res, 400, { success: false, error: 'Please enter a valid email address (e.g. name@domain.com)' });
    }
    const source = String(body.source || 'tsc-footer').slice(0, 80);

    if (db.isConfigured()) {
      // Primary record: the subscribers collection in MongoDB.
      const result = await db.subscribe({ email, source, sourceSite: 'tsc-website' });
      const notified = await notifyTaskmaster(email, source);
      if (!notified.ok) console.warn('[newsletter] Taskmaster notify failed', notified.status || '', notified.timedOut ? 'timeout' : '');
      return sendJson(res, 200, {
        success: true,
        message: result.created || result.reactivated ? 'Welcome to the TSC Family!' : "You're already on the list. Thank you!",
      });
    }

    // Not configured yet (no NEWSLETTER_MONGODB_URI): fall back to the original Taskmaster-only path.
    const { ok, status, body: tm } = await forwardToTaskmaster({
      url: resolveWebhookUrl('TASKMASTER_NEWSLETTER_WEBHOOK_URL', '/api/webhooks/newsletter'),
      secret: process.env.NEWSLETTER_WEBHOOK_SECRET,
      payload: taskmasterPayload(email, source),
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

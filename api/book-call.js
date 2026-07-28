const {
  forwardToTaskmaster,
  resolveWebhookUrl,
  readJsonBody,
  sendJson,
  normalizeIndiaPhone,
  trim,
} = require('./_lib/taskmaster.cjs');

module.exports = async function bookCall(req, res) {
  if (req.method === 'OPTIONS') return sendJson(res, 204, {});
  if (req.method !== 'POST') return sendJson(res, 405, { success: false, error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'object' && req.body ? req.body : await readJsonBody(req);
    const secret = (process.env.BOOK_CALL_WEBHOOK_SECRET || '').trim();
    if (!secret) {
      return sendJson(res, 500, { success: false, error: 'BOOK_CALL_WEBHOOK_SECRET is not set' });
    }

    const payload = {
      ...body,
      name: trim(body.name),
      email: trim(body.email).toLowerCase(),
      phone: normalizeIndiaPhone(body.phone || body.mobile),
      source: 'tsc-website',
      sourceSite: 'tsc-website',
    };

    const { ok, status, body: tm } = await forwardToTaskmaster({
      url: resolveWebhookUrl('TASKMASTER_WEBHOOK_URL', '/api/webhooks/book-call'),
      secret,
      payload,
    });

    if (!ok) {
      return sendJson(res, status >= 400 && status < 600 ? status : 502, {
        success: false,
        error: (tm && (tm.error || tm.details)) || `CRM sync failed (${status})`,
      });
    }

    return sendJson(res, 200, {
      success: true,
      message: (tm && tm.message) || 'Call booked successfully!',
      leadId: tm && tm.leadId,
    });
  } catch (err) {
    console.error('[book-call]', err.message || err);
    return sendJson(res, 500, { success: false, error: 'We could not save your booking. Please try again.' });
  }
};

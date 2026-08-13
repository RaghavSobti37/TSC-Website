const {
  forwardToTaskmaster,
  resolveWebhookUrl,
  readJsonBody,
  sendJson,
  normalizeIndiaPhone,
  trim,
} = require('./_lib/taskmaster.cjs');

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

module.exports = async function bookCall(req, res) {
  if (req.method === 'OPTIONS') return sendJson(res, 204, {});
  if (req.method !== 'POST') return sendJson(res, 405, { success: false, error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'object' && req.body ? req.body : await readJsonBody(req);
    const name = trim(body.name);
    const email = trim(body.email).toLowerCase();
    const phone = normalizeIndiaPhone(body.phone || body.mobile);
    const course = trim(body.course);
    const date = trim(body.date);
    const time = trim(body.time);

    if (!name) return sendJson(res, 400, { success: false, error: 'Name is required' });
    if (!isEmail(email)) return sendJson(res, 400, { success: false, error: 'Valid email is required' });
    if (!phone) return sendJson(res, 400, { success: false, error: 'Phone is required' });
    if (!course) return sendJson(res, 400, { success: false, error: 'Course is required' });
    if (!date) return sendJson(res, 400, { success: false, error: 'Date is required' });
    if (!time) return sendJson(res, 400, { success: false, error: 'Time is required' });

    const secret = (process.env.BOOK_CALL_WEBHOOK_SECRET || '').trim();
    if (!secret) {
      return sendJson(res, 500, { success: false, error: 'BOOK_CALL_WEBHOOK_SECRET is not set' });
    }

    const payload = {
      ...body,
      name,
      email,
      phone,
      course,
      date,
      time,
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

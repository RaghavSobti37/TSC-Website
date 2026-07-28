const {
  forwardToTaskmaster,
  resolveWebhookUrl,
  readJsonBody,
  sendJson,
  normalizeIndiaPhone,
  trim,
} = require('./_lib/taskmaster.cjs');

module.exports = async function leads(req, res) {
  if (req.method === 'OPTIONS') return sendJson(res, 204, {});
  if (req.method !== 'POST') return sendJson(res, 405, { success: false, error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'object' && req.body ? req.body : await readJsonBody(req);
    const payload = {
      source: 'TSC Website Contact',
      sourceSite: 'tsc-website',
      submittedAt: new Date().toISOString(),
      userType: trim(body.userType),
      name: trim(body.name),
      email: trim(body.email).toLowerCase(),
      phone: normalizeIndiaPhone(body.phone || body.mobile),
      message: trim(body.message),
      genres: trim(body.genres),
      experience: trim(body.experience),
      lookingFor: trim(body.lookingFor),
      company: trim(body.company || body.organization),
      budget: trim(body.budget),
      campaignType: trim(body.campaignType),
      focusArea: trim(body.focusArea),
      capital: trim(body.capital),
      timeline: trim(body.timeline),
    };

    if (!payload.userType) return sendJson(res, 400, { success: false, error: 'User type is required' });
    if (!payload.name) return sendJson(res, 400, { success: false, error: 'Name is required' });
    if (!payload.email) return sendJson(res, 400, { success: false, error: 'Email is required' });
    if (!payload.phone) return sendJson(res, 400, { success: false, error: 'Phone is required' });
    if (!payload.message) return sendJson(res, 400, { success: false, error: 'Message is required' });

    const secret = (process.env.ARTIST_ENQUIRY_WEBHOOK_SECRET || '').trim();
    if (!secret) {
      return sendJson(res, 500, { success: false, error: 'ARTIST_ENQUIRY_WEBHOOK_SECRET is not set' });
    }

    const { ok, status, body: tm } = await forwardToTaskmaster({
      url: resolveWebhookUrl('TASKMASTER_CONTACT_LEAD_WEBHOOK_URL', '/api/webhooks/contact-lead'),
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
      message: (tm && tm.message) || 'Lead submitted',
      leadId: tm && tm.leadId,
    });
  } catch (err) {
    console.error('[leads]', err.message || err);
    return sendJson(res, 500, { success: false, error: 'We could not send your message. Please try again.' });
  }
};

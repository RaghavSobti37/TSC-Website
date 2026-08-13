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

module.exports = async function query(req, res) {
  if (req.method === 'OPTIONS') return sendJson(res, 204, {});
  if (req.method !== 'POST') return sendJson(res, 405, { success: false, error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'object' && req.body ? req.body : await readJsonBody(req);
    if (!body || Object.keys(body).length === 0) {
      return sendJson(res, 400, { success: false, error: 'Empty request body' });
    }

    const name = trim(body.name);
    const email = trim(body.email).toLowerCase();
    const phone = normalizeIndiaPhone(body.phone || body.mobile);
    if (!name) return sendJson(res, 400, { success: false, error: 'Name is required' });
    if (!isEmail(email)) return sendJson(res, 400, { success: false, error: 'Valid email is required' });
    if (!phone) return sendJson(res, 400, { success: false, error: 'Phone is required' });

    const secret = (process.env.ARTIST_ENQUIRY_WEBHOOK_SECRET || '').trim();
    if (!secret) {
      return sendJson(res, 500, { success: false, error: 'ARTIST_ENQUIRY_WEBHOOK_SECRET is not set' });
    }

    const payload = {
      source: 'tsc-website',
      sourceSite: 'tsc-website',
      name,
      email,
      phone,
      artist: trim(body.artist),
      organization: trim(body.company || body.organization),
      company: trim(body.company || body.organization),
      collaborationType: trim(body.collabType || body.collaborationType),
      engagementType: trim(body.collabType || body.collaborationType),
      nature: trim(body.nature || body.projectNature),
      projectNature: trim(body.nature || body.projectNature),
      whenWhere: trim(body.locationTime || body.whenWhere),
      whenAndWhere: trim(body.locationTime || body.whenWhere),
      scaleReach: trim(body.scale || body.scaleReach),
      scale: trim(body.scale || body.scaleReach),
      logistics: trim(body.logisticsSupport || body.logistics),
      logisticsSupport: trim(body.logisticsSupport || body.logistics),
      vision: trim(body.additionalVision || body.vision || body.message),
      extraVision: trim(body.additionalVision || body.vision || body.message),
      details: trim(body.additionalVision || body.vision || body.message),
    };

    const { ok, status, body: tm } = await forwardToTaskmaster({
      url: resolveWebhookUrl('TASKMASTER_ARTIST_ENQUIRY_WEBHOOK_URL', '/api/webhooks/artist-enquiry'),
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
      message: (tm && tm.message) || 'Enquiry submitted — our team will follow up soon',
      taskId: tm && tm.taskId,
      leadId: tm && tm.leadId,
    });
  } catch (err) {
    console.error('[query]', err.message || err);
    return sendJson(res, 500, { success: false, error: 'We could not save your enquiry. Please try again.' });
  }
};

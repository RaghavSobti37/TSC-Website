const {
  forwardToTaskmaster,
  resolveWebhookUrl,
  resolveTaskmasterBaseUrl,
  readJsonBody,
  sendJson,
} = require('./_lib/taskmaster.cjs');

const REQUIRED = [
  'firstName',
  'lastName',
  'registeredMobile',
  'registeredEmail',
  'oneLineExperience',
  'improvementSuggestion',
];

async function handle(req, res, campaign) {
  if (req.method === 'OPTIONS') return sendJson(res, 204, {});

  if (req.method === 'GET') {
    try {
      const base = resolveTaskmasterBaseUrl();
      const url = `${base}/api/public/masterclass-reviews?campaign=${encodeURIComponent(campaign)}`;
      const r = await fetch(url);
      const body = await r.json().catch(() => ({}));
      return sendJson(res, r.status, body);
    } catch (err) {
      return sendJson(res, 500, { error: 'Could not load reviews.' });
    }
  }

  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

  try {
    const data = typeof req.body === 'object' && req.body ? req.body : await readJsonBody(req);
    const missing = REQUIRED.filter((f) => !data[f]);
    if (missing.length) {
      return sendJson(res, 400, { error: 'Missing required fields', required: REQUIRED });
    }

    const secret = (process.env.MASTERCLASS_REVIEW_WEBHOOK_SECRET || '').trim();
    const { ok, status, body: tm } = await forwardToTaskmaster({
      url: resolveWebhookUrl('TASKMASTER_MASTERCLASS_REVIEW_WEBHOOK_URL', '/api/webhooks/masterclass-review'),
      secret,
      payload: {
        ...data,
        source: 'tsc-website',
        sourceSite: 'tsc-website',
        campaign,
      },
    });

    if (!ok) {
      return sendJson(res, status >= 400 && status < 600 ? status : 502, {
        error: (tm && tm.error) || `Review sync failed (${status})`,
      });
    }

    return sendJson(res, 200, { success: true, message: 'Successfully submitted review.' });
  } catch (err) {
    console.error('[reviews]', err.message || err);
    return sendJson(res, 500, { error: 'We could not submit your review. Please try again.' });
  }
}

module.exports = async function reviews(req, res) {
  return handle(req, res, 'review01');
};

module.exports.handle = handle;

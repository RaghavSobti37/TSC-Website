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

function buildArtistPathPayload(data) {
  const firstName = trim(data.firstName);
  const lastName = trim(data.lastName);
  const fullName = `${firstName} ${lastName}`.trim() || trim(data.fullName || data.name);
  const email = trim(data.email).toLowerCase();
  const mobile = normalizeIndiaPhone(data.mobile || data.phone);
  return {
    source: 'tsc-website',
    sourceSite: 'tsc-website',
    firstName,
    lastName,
    fullName,
    stageName: data.stageName,
    place: data.place,
    instagram: data.instagram,
    spotify: data.spotify,
    youtube: data.youtube,
    mobile,
    email,
    artistIdentity: data.artistIdentity,
    trainingDetails: data.trainingDetails,
    coreSkills: data.coreSkills,
    strengthsUniqueness: data.strengthsUniqueness,
    dailyTime: data.dailyTime,
    mentorName: data.mentorName,
    songsReleased: data.songsReleased,
    showsPerformed: data.showsPerformed,
    currentFans: data.currentFans,
    currentSetup: data.currentSetup,
    currentlyWorkingOn: data.currentlyWorkingOn,
    dailyRituals: data.dailyRituals,
    learningNeeds: data.learningNeeds,
    mentorshipNeeds: data.mentorshipNeeds,
    curationNeeds: data.curationNeeds,
    fandomNeeds: data.fandomNeeds,
    aspirationalGoal: data.aspirationalGoal,
    anythingElse: data.anythingElse,
  };
}

module.exports = async function artistPath(req, res) {
  if (req.method === 'OPTIONS') return sendJson(res, 204, {});
  if (req.method !== 'POST') return sendJson(res, 405, { success: false, error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'object' && req.body ? req.body : await readJsonBody(req);
    const payload = buildArtistPathPayload(body);
    if (!payload.fullName) return sendJson(res, 400, { success: false, error: 'Name is required' });
    if (!isEmail(payload.email)) return sendJson(res, 400, { success: false, error: 'Valid email is required' });
    if (!payload.mobile) return sendJson(res, 400, { success: false, error: 'Mobile number is required' });

    const secret = (process.env.ARTIST_PATH_WEBHOOK_SECRET || '').trim();
    if (!secret) {
      return sendJson(res, 500, { success: false, error: 'ARTIST_PATH_WEBHOOK_SECRET is not set' });
    }

    const { ok, status, body: tm } = await forwardToTaskmaster({
      url: resolveWebhookUrl('TASKMASTER_ARTIST_PATH_WEBHOOK_URL', '/api/webhooks/artist-path'),
      secret,
      payload,
    });

    if (!ok) {
      return sendJson(res, status >= 400 && status < 600 ? status : 502, {
        success: false,
        error: (tm && tm.error) || `Artist path sync failed (${status})`,
      });
    }

    return sendJson(res, 200, {
      success: true,
      message: 'Successfully submitted',
      taskmasterSynced: true,
    });
  } catch (err) {
    console.error('[artist-path]', err.message || err);
    return sendJson(res, 500, { success: false, error: 'We could not save your artist path. Please try again.' });
  }
};

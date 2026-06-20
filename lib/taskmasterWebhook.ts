import crypto from 'crypto';

const PRODUCTION_TASKMASTER_HOST = 'https://taskmaster-jfw0.onrender.com';
const LOCAL_TASKMASTER_HOST = 'http://127.0.0.1:5000';

export function resolveTaskmasterBaseUrl(): string {
  const configured = (process.env.TASKMASTER_API_URL || process.env.TASKMASTER_BASE_URL || '').trim();
  if (configured) return configured.replace(/\/$/, '');

  if (process.env.NODE_ENV === 'production') {
    throw new Error('Missing required env var in production: TASKMASTER_API_URL');
  }

  return LOCAL_TASKMASTER_HOST;
}

export function resolveWebhookUrl(envKey: string, defaultPath: string): string {
  const configured = (process.env[envKey] || '').trim();
  if (configured) return configured;

  if (process.env.NODE_ENV === 'production') {
    return `${resolveTaskmasterBaseUrl()}${defaultPath}`;
  }

  return `${LOCAL_TASKMASTER_HOST}${defaultPath}`;
}

export function computeWebhookSignature(rawBody: string, secret: string): string {
  return `sha256=${crypto.createHmac('sha256', secret).update(rawBody).digest('hex')}`;
}

export async function forwardToTaskmaster({
  url,
  secret,
  payload,
  useHmac = false,
}: {
  url: string;
  secret?: string;
  payload: Record<string, unknown>;
  useHmac?: boolean;
}): Promise<{ ok: boolean; status: number; body: unknown }> {
  const body = JSON.stringify(payload);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (secret) {
    if (useHmac) {
      headers['X-Webhook-Signature'] = computeWebhookSignature(body, secret);
    } else {
      headers['X-Webhook-Secret'] = secret;
    }
  }

  const res = await fetch(url, { method: 'POST', headers, body });
  const parsed = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body: parsed };
}

export function buildArtistPathPayload(data: Record<string, unknown>): Record<string, unknown> {
  const firstName = String(data.firstName || '').trim();
  const lastName = String(data.lastName || '').trim();
  const fullName = `${firstName} ${lastName}`.trim();

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
    mobile: data.mobile,
    email: data.email,
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

export function buildMasterclassReviewPayload(
  data: Record<string, unknown>,
  campaign: 'review01' | 'review02'
): Record<string, unknown> {
  return {
    ...data,
    source: 'tsc-website',
    sourceSite: 'tsc-website',
    campaign,
  };
}

export { PRODUCTION_TASKMASTER_HOST };

const DEFAULT_ARTIST_ENQUIRY_WEBHOOK_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://taskmaster-jfw0.onrender.com/api/webhooks/artist-enquiry'
    : 'http://127.0.0.1:5000/api/webhooks/artist-enquiry';

function resolveArtistEnquiryWebhookUrl(): string {
  const explicit = (process.env.TASKMASTER_ARTIST_ENQUIRY_WEBHOOK_URL || '').trim();
  if (explicit) return explicit;

  const bookCallUrl = (process.env.TASKMASTER_WEBHOOK_URL || process.env.CRM_WEBHOOK_URL || '').trim();
  if (bookCallUrl) {
    return bookCallUrl.replace(/book-call\/?$/, 'artist-enquiry');
  }

  return DEFAULT_ARTIST_ENQUIRY_WEBHOOK_URL;
}

export async function forwardToTaskmaster(data: Record<string, unknown>): Promise<void> {
  const taskmasterUrl = resolveArtistEnquiryWebhookUrl();

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const secret = process.env.ARTIST_ENQUIRY_WEBHOOK_SECRET;
  if (secret) headers['X-Webhook-Secret'] = secret;

  try {
    const res = await fetch(taskmasterUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('[artist-enquiry] Taskmaster forward non-OK', res.status, body);
    }
  } catch (e) {
    console.error('[artist-enquiry] Taskmaster forward failed', e);
  }
}

export function buildTaskmasterEnquiryPayload(data: Record<string, string>): Record<string, unknown> {
  return {
    name: data.name,
    email: data.email,
    phone: data.phone,
    artist: data.artist,
    organization: data.company,
    company: data.company,
    collaborationType: data.collabType,
    engagementType: data.collabType,
    nature: data.nature,
    projectNature: data.nature,
    whenWhere: data.locationTime,
    whenAndWhere: data.locationTime,
    scaleReach: data.scale,
    scale: data.scale,
    logistics: data.logisticsSupport,
    logisticsSupport: data.logisticsSupport,
    vision: data.additionalVision,
    extraVision: data.additionalVision,
    details: data.additionalVision,
  };
}

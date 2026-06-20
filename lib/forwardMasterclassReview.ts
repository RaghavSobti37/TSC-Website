import { buildMasterclassReviewPayload, forwardToTaskmaster, resolveTaskmasterBaseUrl, resolveWebhookUrl } from './taskmasterWebhook';

const DEFAULT_PUBLIC_REVIEWS_PATH = '/api/public/masterclass-reviews';

export function resolveMasterclassReviewWebhookUrl(): string {
  return resolveWebhookUrl('TASKMASTER_MASTERCLASS_REVIEW_WEBHOOK_URL', '/api/webhooks/masterclass-review');
}

export function resolvePublicReviewsUrl(campaign: 'review01' | 'review02'): string {
  const base = (process.env.TASKMASTER_PUBLIC_REVIEWS_URL || '').trim();
  if (base) {
    const joiner = base.includes('?') ? '&' : '?';
    return `${base}${joiner}campaign=${campaign}`;
  }

  const taskmasterBase = (process.env.TASKMASTER_BASE_URL || '').trim();
  if (taskmasterBase) {
    return `${taskmasterBase.replace(/\/$/, '')}${DEFAULT_PUBLIC_REVIEWS_PATH}?campaign=${campaign}`;
  }

  return `${resolveTaskmasterBaseUrl()}${DEFAULT_PUBLIC_REVIEWS_PATH}?campaign=${campaign}`;
}

export async function forwardMasterclassReview(
  body: Record<string, unknown>,
  campaign: 'review01' | 'review02'
) {
  return forwardToTaskmaster({
    url: resolveMasterclassReviewWebhookUrl(),
    secret: process.env.MASTERCLASS_REVIEW_WEBHOOK_SECRET,
    payload: buildMasterclassReviewPayload(body, campaign),
  });
}

export async function fetchPublicReviews(campaign: 'review01' | 'review02') {
  const url = resolvePublicReviewsUrl(campaign);
  const res = await fetch(url, { method: 'GET' });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

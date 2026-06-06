import type { NextApiRequest, NextApiResponse } from 'next';
import { buildArtistPathPayload, forwardToTaskmaster, resolveWebhookUrl } from '@/lib/taskmasterWebhook';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, ...data } = req.body as Record<string, unknown>;
    const payload = buildArtistPathPayload({ firstName, lastName, ...data });

    const { ok, status, body } = await forwardToTaskmaster({
      url: resolveWebhookUrl('TASKMASTER_ARTIST_PATH_WEBHOOK_URL', '/api/webhooks/artist-path'),
      secret: process.env.ARTIST_PATH_WEBHOOK_SECRET,
      payload,
    });

    if (!ok) {
      const err =
        (body as { error?: string })?.error ||
        `Artist path sync failed (${status})`;
      throw new Error(err);
    }

    return res.status(200).json({ success: true, message: 'Successfully submitted' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('[artist-path] Taskmaster forward failed:', message);
    return res.status(500).json({ success: false, error: message });
  }
}

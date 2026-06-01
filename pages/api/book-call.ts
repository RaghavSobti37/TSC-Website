import type { NextApiRequest, NextApiResponse } from 'next';

const DEFAULT_CRM_WEBHOOK_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://taskmaster-jfw0.onrender.com/api/webhooks/book-call'
    : 'http://127.0.0.1:5000/api/webhooks/book-call';

function resolveCrmWebhookUrl(): string {
  const configured = (process.env.TASKMASTER_WEBHOOK_URL || process.env.CRM_WEBHOOK_URL || '').trim();
  return configured || DEFAULT_CRM_WEBHOOK_URL;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const crmWebhookUrl = resolveCrmWebhookUrl();

  try {
    const crmResponse = await fetch(crmWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    if (!crmResponse.ok) {
      const errorText = await crmResponse.text();
      throw new Error(`CRM Sync Failed (${crmResponse.status}): ${errorText}`);
    }

    const payload = await crmResponse.json().catch(() => ({}));
    return res.status(crmResponse.status === 202 ? 200 : crmResponse.status).json({
      success: true,
      message: (payload as { message?: string }).message || 'Call booked successfully!'
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('API Error:', { crmWebhookUrl, message });
    return res.status(500).json({ success: false, error: message });
  }
}


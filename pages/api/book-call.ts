import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const crmResponse = await fetch('http://localhost:5000/api/webhooks/book-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    if (!crmResponse.ok) {
      const errorText = await crmResponse.text();
      throw new Error(`CRM Sync Failed: ${errorText}`);
    }

    return res.status(200).json({ success: true, message: 'Call booked successfully!' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}


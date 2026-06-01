import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import { buildTaskmasterEnquiryPayload, forwardToTaskmaster } from '@/lib/forwardArtistEnquiry';

const SPREADSHEET_ID = '1Yyj8bL8-9lRiJTKhkqQb1X_5Yu02zGCzGPFHln85Pa0';

function sanitizeField(text: unknown): string {
  if (text == null) return '';
  return String(text).trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ success: false, error: 'Empty request body' });
    }

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const sanitized = {
      name: sanitizeField(data.name),
      company: sanitizeField(data.company),
      email: sanitizeField(data.email),
      phone: sanitizeField(data.phone),
      collabType: sanitizeField(data.collabType),
      artist: sanitizeField(data.artist),
      nature: sanitizeField(data.nature),
      locationTime: sanitizeField(data.locationTime),
      scale: sanitizeField(data.scale),
      logisticsSupport: sanitizeField(data.logisticsSupport),
      additionalVision: sanitizeField(data.additionalVision),
    };

    const row = [
      timestamp,
      sanitized.name,
      sanitized.company,
      sanitized.email,
      sanitized.phone,
      sanitized.collabType,
      sanitized.artist,
      sanitized.nature,
      sanitized.locationTime,
      sanitized.scale,
      sanitized.logisticsSupport,
      sanitized.additionalVision,
    ];

    let serviceAccount;
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      serviceAccount = {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/^"|"$/g, ''),
      };
    } else {
      const serviceAccountPath = path.join(process.cwd(), 'google_service_account.json');
      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccountJson = fs.readFileSync(serviceAccountPath, 'utf8');
        serviceAccount = JSON.parse(serviceAccountJson);
      } else {
        throw new Error('Google Service Account credentials missing.');
      }
    }

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    try {
      const HEADER_ROW = [
        'Timestamp', 'Name', 'Company', 'Email', 'Phone',
        'Collaboration Type', 'Artist/Talent', 'Nature of Project',
        'When & Where', 'Scale/Reach', 'Logistics Provided?', 'Vision/Details',
      ];
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Inqueries!A1:L1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [HEADER_ROW] },
      });
    } catch (e) {
      console.warn('Header update failed:', e);
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Inqueries!A2',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });

    await forwardToTaskmaster(buildTaskmasterEnquiryPayload(sanitized));

    return res.status(200).json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('API Error:', message);
    return res.status(500).json({ success: false, error: message });
  }
}

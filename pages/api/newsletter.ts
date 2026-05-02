import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const SPREADSHEET_ID = '1uQjA_sroaTyL1boHO9wUkp16SmBRoDE8CkPa03uMi5U';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    // Prepare row data: Timestamp, Email
    const row = [
      new Date().toLocaleString(),
      email
    ];

    // Read the service account credentials from env vars or file
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
        throw new Error('Google Service Account credentials missing. Please set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY in production.');
      }
    }

    // Create an auth client
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Create a Sheets API instance
    const sheets = google.sheets({ version: 'v4', auth });

    // Optional: Ensure headers exist on first run
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'A1:B1',
      });
      const firstRow = response.data.values?.[0] || [];
      if (!firstRow.length || firstRow[0] !== 'Timestamp') {
        const HEADER_ROW = ['Timestamp', 'Email'];
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: 'A1:B1',
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [HEADER_ROW] },
        });
      }
    } catch (e) {
      console.warn('Could not check or set headers (ensure service account has access):', e);
    }

    // Append the new row
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'A2', // Start looking from row 2
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row],
      },
    });

    return res.status(200).json({ success: true, message: 'Successfully subscribed' });
  } catch (error: any) {
    console.error('Newsletter API Error:', error.message || error);
    return res.status(500).json({ success: false, error: 'Internal server error: ' + (error.message || 'Unknown error') });
  }
}

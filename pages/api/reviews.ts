import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const SPREADSHEET_ID = '1xumI6lRo2I22S-q1YvFQq3uNEtH2YFwMU9y11gVU0m0';
const SHEET_NAME = 'Prasad MasterclassReviews';
const RANGE = `${SHEET_NAME}!A:F`; 
const HEADER_ROW = ['Date', 'Name', 'Title', 'Content', 'Rating', 'Approved'];

export default async function handler(req: any, res: any) {
  try {
    let serviceAccount;
    
    try {
      if (process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
        // Use environment variable in production (Vercel)
        // Vercel sometimes escapes newlines differently, so we ensure \n is handled
        const envVal = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
        serviceAccount = JSON.parse(envVal);
        if (serviceAccount.private_key) {
           serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
      } else {
        // Fallback to local file in development
        const serviceAccountPath = path.join(process.cwd(), 'google_service_account.json');
        if (!fs.existsSync(serviceAccountPath)) {
          return res.status(500).json({ error: 'Service account configuration missing' });
        }
        serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      }
    } catch (parseErr: any) {
      return res.status(500).json({ error: 'Configuration parsing failed', details: parseErr.message });
    }

    // Create an auth client
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    // Create a Sheets API instance
    const sheets = google.sheets({ version: 'v4', auth });

    // Helper function to ensure sheet and headers exist if possible
    const ensureSheetAndHeaders = async () => {
      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_NAME}!A1:F1`,
        });

        const firstRow = response.data.values?.[0] || [];
        if (!firstRow.length || firstRow[0] !== 'Date') {
          // Headers don't exist, try to add them
          await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A1:F1`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [HEADER_ROW],
            },
          });
        }
      } catch (error: any) {
        // If it's a 'range not found' or 'permission denied', we throw it to be handled cleanly
        throw error;
      }
    };

    if (req.method === 'GET') {
      try {
        await ensureSheetAndHeaders();
      } catch (e: any) {
        // If the sheet doesn't exist yet, we just return empty reviews smoothly.
        if (e.message.includes('Unable to parse range') || e.message.includes('permission')) {
           return res.status(200).json({ success: true, count: 0, totalCount: 0, reviews: [] });
        }
        return res.status(500).json({ error: 'Failed to ensure sheet', details: e.message });
      }

      // Fetch all reviews
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
      });

      const rows = response.data.values || [];
      
      // Transform the data into objects (skip header row)
      const data = rows.slice(1).map((row, index) => ({
        id: index + 1,
        date: row[0] || '',
        name: row[1] || 'Anonymous',
        title: row[2] || '',
        content: row[3] || '',
        rating: parseInt(row[4] || '5', 10),
        approved: row[5] === 'TRUE',
      }));

      // Filter to only show approved reviews on the frontend
      const approvedReviews = data.filter(review => review.approved);

      res.status(200).json({ 
        success: true, 
        count: approvedReviews.length,
        totalCount: data.length,
        reviews: approvedReviews 
      });
      
    } else if (req.method === 'POST') {
      try {
         await ensureSheetAndHeaders();
      } catch (e: any) {
         if (e.message.includes('Unable to parse range') || e.message.includes('permission')) {
            return res.status(400).json({ 
               error: 'Setup Required: Please create a new tab named "Prasad MasterclassReviews" in your Google Sheet (ID: 1xumI6lRo2I22S-q1YvFQq3uNEtH2YFwMU9y11gVU0m0).' 
            });
         }
         return res.status(500).json({ error: 'Failed to ensure sheet', details: e.message });
      }

      const { name, title, content, rating } = req.body;

      if (!content) {
        return res.status(400).json({ error: 'Review content is required' });
      }

      // Add new review (Approved starts as FALSE)
      const timestamp = new Date().toLocaleString();
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2`, 
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[timestamp, name || 'Anonymous', title || 'Review', content, rating || 5, 'FALSE']],
        },
      });

      res.status(200).json({ 
        success: true, 
        message: 'Successfully submitted review. Waiting for approval.',
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Error with Google Sheets API:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message 
    });
  }
}

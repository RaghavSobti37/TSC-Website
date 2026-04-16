import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const SPREADSHEET_ID = '1xumI6lRo2I22S-q1YvFQq3uNEtH2YFwMU9y11gVU0m0';
const SHEET_NAME = 'Prasad MasterclassReviews';
const RANGE = `${SHEET_NAME}!A:G`; 
const HEADER_ROW = ['Date', 'Name', 'Title', 'Content', 'RatingText', 'RatingNumber', 'Approved'];

const ratingLabels: { [key: number]: string } = {
  5: 'Excellent',
  4: 'Good',
  3: 'Fine',
  2: 'Bad',
  1: 'Poor'
};

export default async function handler(req: any, res: any) {
  try {
    let serviceAccount;
    
    try {
      if (process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
        const envVal = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
        serviceAccount = JSON.parse(envVal);
        if (serviceAccount.private_key) {
           serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
      } else {
        const serviceAccountPath = path.join(process.cwd(), 'google_service_account.json');
        if (!fs.existsSync(serviceAccountPath)) {
          return res.status(500).json({ error: 'Service account configuration missing' });
        }
        serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      }
    } catch (parseErr: any) {
      return res.status(500).json({ error: 'Configuration parsing failed', details: parseErr.message });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const ensureSheetAndHeaders = async () => {
      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: `${SHEET_NAME}!A1:G1`,
        });

        const firstRow = response.data.values?.[0] || [];
        if (!firstRow.length || firstRow[0] !== 'Date') {
          await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A1:G1`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [HEADER_ROW],
            },
          });
        }
      } catch (error: any) {
        throw error;
      }
    };

    if (req.method === 'GET') {
      try {
        await ensureSheetAndHeaders();
      } catch (e: any) {
        if (e.message.includes('Unable to parse range') || e.message.includes('permission')) {
           return res.status(200).json({ success: true, count: 0, totalCount: 0, reviews: [], stats: null });
        }
        return res.status(500).json({ error: 'Failed to ensure sheet', details: e.message });
      }

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
      });

      const rows = response.data.values || [];
      
      const allReviews = rows.slice(1).map((row, index) => ({
        id: index + 1,
        date: row[0] || '',
        name: row[1] || 'Anonymous',
        title: row[2] || '',
        content: row[3] || '',
        ratingText: row[4] || '',
        rating: parseInt(row[5] || '5', 10),
        approved: row[6] === 'TRUE',
      }));

      // Calculate stats based on ALL data
      const totalCount = allReviews.length;
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      let sumRating = 0;

      allReviews.forEach(r => {
        const rate = r.rating as keyof typeof distribution;
        if (distribution[rate] !== undefined) {
          distribution[rate]++;
          sumRating += rate;
        }
      });

      const averageRating = totalCount > 0 ? (sumRating / totalCount).toFixed(1) : "5.0";

      // Filter for frontend display
      const approvedReviews = allReviews.filter(review => review.approved);

      res.status(200).json({ 
        success: true, 
        count: approvedReviews.length,
        totalCount: totalCount,
        reviews: approvedReviews,
        stats: {
          average: averageRating,
          distribution: [
            { stars: 5, count: distribution[5] },
            { stars: 4, count: distribution[4] },
            { stars: 3, count: distribution[3] },
            { stars: 2, count: distribution[2] },
            { stars: 1, count: distribution[1] }
          ]
        }
      });
      
    } else if (req.method === 'POST') {
      try {
         await ensureSheetAndHeaders();
      } catch (e: any) {
         if (e.message.includes('Unable to parse range') || e.message.includes('permission')) {
            return res.status(400).json({ error: 'Setup Required' });
         }
         return res.status(500).json({ error: 'Failed to ensure sheet', details: e.message });
      }

      const { name, title, content, rating } = req.body;
      if (!content) return res.status(400).json({ error: 'Review content is required' });

      const numericRating = parseInt(rating || '5', 10);
      const textRating = ratingLabels[numericRating] || 'Excellent';
      const timestamp = new Date().toLocaleString();

      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A2`, 
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[timestamp, name || 'Anonymous', title || 'Review', content, textRating, numericRating, 'FALSE']],
        },
      });

      res.status(200).json({ 
        success: true, 
        message: 'Successfully submitted review.',
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Error with Google Sheets API:', error);
    res.status(500).json({ error: 'Failed to process request', details: error.message });
  }
}

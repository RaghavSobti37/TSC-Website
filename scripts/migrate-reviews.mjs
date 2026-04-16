// migrate-reviews.mjs
import { google } from 'googleapis';
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SPREADSHEET_ID = '1xumI6lRo2I22S-q1YvFQq3uNEtH2YFwMU9y11gVU0m0';
const SHEET_NAME = 'Prasad MasterclassReviews';
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '../google_service_account.json');

const ratingTextMap = {
  5: 'Excellent',
  4: 'Good',
  3: 'Fine',
  2: 'Bad',
  1: 'Poor'
};

const NEW_HEADER = ['Date', 'Name', 'Title', 'Content', 'RatingText', 'RatingNumber', 'Approved'];

async function main() {
  const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  console.log('🔄 Fetching current reviews...');
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:F`,
  });

  const rows = response.data.values || [];
  if (rows.length === 0) {
    console.log('⚠️ No rows found. Initializing with header.');
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:G1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [NEW_HEADER] },
    });
    return;
  }

  // Skip header, transform data
  const migratedRows = rows.slice(1).map(row => {
    // Current: 0:Date, 1:Name, 2:Title, 3:Content, 4:Rating, 5:Approved
    const date = row[0] || '';
    const name = row[1] || '';
    const title = row[2] || '';
    const content = row[3] || '';
    const ratingNum = parseInt(row[4] || '5', 10);
    const ratingText = ratingTextMap[ratingNum] || 'Excellent';
    const approved = row[5] || 'FALSE';

    return [date, name, title, content, ratingText, ratingNum, approved];
  });

  console.log(`📦 Migrating ${migratedRows.length} rows to 7-column format...`);

  // Clear existing sheet first
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:Z`,
  });

  // Update with new header and data
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [NEW_HEADER, ...migratedRows],
    },
  });

  console.log('✅ Migration complete!');
}

main().catch(console.error);

// check-sheet.mjs
import { google } from 'googleapis';
import path from 'path';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SPREADSHEET_ID = '1xumI6lRo2I22S-q1YvFQq3uNEtH2YFwMU9y11gVU0m0';
const SHEET_NAME = 'Prasad MasterclassReviews';
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '../google_service_account.json');

async function main() {
  const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A1:Z10`,
  });

  console.log('Current Sheet Head (First 10 rows):');
  console.log(JSON.stringify(response.data.values, null, 2));
}

main().catch(console.error);

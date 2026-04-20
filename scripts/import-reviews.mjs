// import-reviews.mjs
// Imports Masterclass Feedback CSV → Google Sheet (Prasad MasterclassReviews)
// Columns: Date | Name | Title | Content | RatingText | RatingNumber | Approved
// Run: node scripts/import-reviews.mjs

import { google } from 'googleapis';
import path from 'path';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SPREADSHEET_ID = '1xumI6lRo2I22S-q1YvFQq3uNEtH2YFwMU9y11gVU0m0';
const SHEET_NAME = 'Prasad MasterclassReviews';
const CSV_PATH = path.join(__dirname, '../../Masterclass Feedback Summary - Masterclass Feedback Summary.csv');
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '../google_service_account.json');

// Map text ratings → numeric stars
const ratingMap = {
  'excellent': 5,
  'good': 4,
  'fine': 3,
  'bad': 2,
  'average': 2, // fallback
  'poor': 1,
};

const ratingTextMap = {
  5: 'Excellent',
  4: 'Good',
  3: 'Fine',
  2: 'Bad',
  1: 'Poor'
};

function parseRating(ratingText) {
  return ratingMap[(ratingText || '').toLowerCase().trim()] ?? 4;
}

// Simple CSV parser that handles quoted fields
function parseCSVLine(line) {
  const result = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(field.trim());
      field = '';
    } else {
      field += ch;
    }
  }
  result.push(field.trim());
  return result;
}

async function main() {
  if (!existsSync(SERVICE_ACCOUNT_PATH)) {
    throw new Error('Service account file not found at ' + SERVICE_ACCOUNT_PATH);
  }

  const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));

  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  if (!existsSync(CSV_PATH)) {
    throw new Error('CSV file not found at ' + CSV_PATH);
  }

  // Read and parse CSV
  const fileContent = readFileSync(CSV_PATH, 'utf8');
  const lines = fileContent.split(/\r?\n/).filter(l => l.trim());

  // Skip header row (index 0)
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 5) continue;

    const name       = cols[0] || 'Anonymous';
    const title      = cols[1] || 'Masterclass Review';
    const ratingNum  = parseRating(cols[2]);
    const ratingText = ratingTextMap[ratingNum] || 'Excellent';
    const content    = cols[4] || '';
    const date       = '4/16/2024';

    if (!content) continue;

    rows.push([date, name, title, content, ratingText, ratingNum, 'FALSE']);
  }

  console.log(`📋 Parsed ${rows.length} reviews from CSV`);

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A2`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: rows },
  });

  console.log(`✅ Successfully imported ${rows.length} reviews into the sheet!`);
  console.log(`   Updated range: ${response.data.updates?.updatedRange}`);
  console.log(`   All reviews set to Approved = FALSE`);
  console.log(`\n👉 Go to your Google Sheet and set Approved = TRUE for the ones you want to display.`);
}

main().catch(err => {
  console.error('❌ Import failed:', err.message);
  process.exit(1);
});

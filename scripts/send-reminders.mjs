import { google } from 'googleapis';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '19sTRQ-lUls_dWYRgL3OM70Ewpcn7M2tWYfOMPLzn8Us';
const SHEET_NAME = 'BookedCalls';
const AISENSY_KEY = process.env.AISENSY_API_KEY;

async function runScheduler() {
  console.log(`[${new Date().toLocaleString()}] Starting reminder check...`);

  if (!AISENSY_KEY) {
    console.error('AISENSY_API_KEY is missing in .env');
    return;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), 'google_service_account.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 1. Get all rows
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:J`, // Now looking for 10 columns
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      console.log('No bookings found.');
      return;
    }

    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const [timestamp, name, email, phone, course, referral, dateStr, timeStr, reminderSent] = rows[i];
      
      // If already sent, skip
      if (reminderSent === 'Yes') continue;

      // Parse appointment time
      // dateStr: 2026-05-08
      // timeStr: 02:00 PM
      const appointmentTime = new Date(`${dateStr} ${timeStr}`);

      // If appointment is within the next 1 hour AND hasn't passed yet
      if (appointmentTime <= oneHourFromNow && appointmentTime > now) {
        console.log(`Triggering reminder for ${name} (${appointmentTime.toLocaleString()})`);

        const firstName = name.split(' ')[0];
        const formattedDate = new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        const cleanDestination = phone.replace(/\D/g, '');

        // 2. Send to AiSensy
        const aiResponse = await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: AISENSY_KEY,
            campaignName: 'book_call_reminder',
            destination: cleanDestination,
            userName: name,
            templateParams: [firstName, timeStr, course], // Variables: {{1}} Name, {{2}} Time, {{3}} Course
            attributes: {
              "FirstName": firstName,
              "ScheduledTime": timeStr,
              "CourseName": course
            }
          }),
        });

        const aiResult = await aiResponse.json();
        
        if (aiResult.success) {
          console.log(`✅ Message sent to ${name}`);
          
          // 3. Update the sheet to 'Yes'
          await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!J${i + 1}`, // Column J is the 10th column
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [['Yes']],
            },
          });
        } else {
          console.error(`❌ Failed to send to ${name}:`, aiResult.message);
        }
      }
    }
  } catch (error) {
    console.error('Scheduler Error:', error);
  }
}

// Run immediately
runScheduler();

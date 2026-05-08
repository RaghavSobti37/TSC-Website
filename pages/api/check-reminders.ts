import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '19sTRQ-lUls_dWYRgL3OM70Ewpcn7M2tWYfOMPLzn8Us';
const SHEET_NAME = 'BookedCalls';
const AISENSY_KEY = process.env.AISENSY_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Security check: Only allow GET requests (from cron services)
  // You can also add a secret token header for extra security
  
  console.log(`[${new Date().toLocaleString()}] Reminder check triggered via API`);

  if (!AISENSY_KEY) {
    return res.status(500).json({ error: 'AISENSY_API_KEY is missing' });
  }

  try {
    // Auth logic
    let serviceAccount;
    const serviceAccountPath = path.join(process.cwd(), 'google_service_account.json');
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      serviceAccount = {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/^"|"$/g, ''),
      };
    } else if (fs.existsSync(serviceAccountPath)) {
      serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    } else {
      throw new Error('Google Service Account credentials missing.');
    }

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 1. Get all rows
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:J`,
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return res.status(200).json({ message: 'No bookings found' });
    }

    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    const sentCount = [];

    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const [timestamp, name, email, phone, course, referral, dateStr, timeStr, reminderSent] = rows[i];
      
      if (reminderSent === 'Yes') continue;

      // Clean the numbers for comparison and date parsing
      const appointmentTime = new Date(`${dateStr} ${timeStr}`);

      // If appointment is within the next 1 hour AND hasn't passed yet
      if (appointmentTime <= oneHourFromNow && appointmentTime > now) {
        const firstName = name.split(' ')[0];
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
            templateParams: [firstName, timeStr, course],
            attributes: {
              "FirstName": firstName,
              "ScheduledTime": timeStr,
              "CourseName": course
            }
          }),
        });

        const aiResult = await aiResponse.json();
        
        if (aiResult.success) {
          sentCount.push(name);
          
          // 3. Update the sheet to 'Yes'
          await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!J${i + 1}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [['Yes']],
            },
          });
        }
      }
    }

    return res.status(200).json({ 
      success: true, 
      processed: rows.length - 1, 
      sentReminders: sentCount 
    });

  } catch (error: any) {
    console.error('API Scheduler Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

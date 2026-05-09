import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '19sTRQ-lUls_dWYRgL3OM70Ewpcn7M2tWYfOMPLzn8Us';
const SHEET_NAME = 'BookedCalls';
const AISENSY_KEY = process.env.AISENSY_API_KEY;

// Business Hours Configuration (IST)
const FIRST_SLOT = '12:00 PM';
const LAST_SLOT = '07:30 PM';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Check if we are within the active reminder window (IST)
  const now = new Date();
  const istTimeStr = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit' });
  const [nowH, nowM] = istTimeStr.split(':').map(Number);
  const nowMinutes = nowH * 60 + nowM;

  // Calculate window bounds in minutes from midnight
  const parseTimeToMinutes = (tStr: string) => {
    const [time, period] = tStr.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  const firstSlotMinutes = parseTimeToMinutes(FIRST_SLOT);
  const lastSlotMinutes = parseTimeToMinutes(LAST_SLOT);

  // Buffer: Start 15 mins before first slot, end exactly at last slot trigger
  if (nowMinutes < firstSlotMinutes - 15 || nowMinutes > lastSlotMinutes) {
    console.log(`[${istTimeStr} IST] Outside reminder window. Skipping check.`);
    return res.status(200).json({ message: 'Outside active reminder window' });
  }

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

    const reminderWindow = new Date(now.getTime() + 15 * 60 * 1000); // Check for appointments in the next 15 mins
    const sentCount = [];

    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const [timestamp, name, email, phone, course, referral, dateStr, timeStr, reminderSent] = rows[i];
      
      if (reminderSent === 'Yes') continue;

      // Clean the numbers for comparison and date parsing
      // We append +05:30 to ensure it's parsed as Indian Standard Time
      const appointmentTime = new Date(`${dateStr} ${timeStr} +05:30`);

      if (isNaN(appointmentTime.getTime())) continue;

      // If appointment is within the next 15 minutes AND hasn't passed yet
      if (appointmentTime <= reminderWindow && appointmentTime > now) {
        console.log(`>>> Sending reminder to ${name} for ${timeStr}`);
        const firstName = name.split(' ')[0];
        const cleanDestination = phone.replace(/\D/g, '');

        // 2. Send to AiSensy
        try {
          const aiResponse = await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              apiKey: AISENSY_KEY,
              campaignName: 'final_book_call_reminder',
              destination: cleanDestination,
              userName: name,
              templateParams: [firstName, "10 minutes", timeStr, course],
              attributes: {
                "FirstName": firstName,
                "TimeRemaining": "10 minutes",
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
              range: `${SHEET_NAME}!I${i + 1}`,
              valueInputOption: 'USER_ENTERED',
              requestBody: {
                values: [['Yes']],
              },
            });
          }
        } catch (e) {
          console.error(`AiSensy Error for ${name}:`, e);
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

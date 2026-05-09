import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '19sTRQ-lUls_dWYRgL3OM70Ewpcn7M2tWYfOMPLzn8Us';
const SHEET_NAME = 'BookedCalls';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { 
      name, 
      email, 
      phone, 
      whatsapp, 
      course, 
      referral, 
      date, 
      time,
      timezone = 'Asia/Kolkata' 
    } = req.body;

    if (!name || !email || !phone || !date || !time) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Helper to convert any local time to IST
    const convertToIST = (dStr: string, tStr: string, tz: string) => {
      try {
        // 1. Parse date and time
        const [year, month, day] = dStr.split('-').map(Number);
        const [time, period] = tStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        // 2. Create a timestamp as if these numbers were UTC
        // This is our "Local Clock" value
        const localClockUTC = Date.UTC(year, month - 1, day, hours, minutes);
        
        // 3. Find what the offset would be for this timezone at this moment
        const getOffset = (timestamp: number, timeZone: string) => {
          const date = new Date(timestamp);
          const parts = new Intl.DateTimeFormat('en-US', {
            timeZone,
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false
          }).formatToParts(date);
          
          const getVal = (type: string) => parseInt(parts.find(p => p.type === type)!.value);
          const utcAtParts = Date.UTC(getVal('year'), getVal('month') - 1, getVal('day'), getVal('hour'), getVal('minute'));
          return (utcAtParts - timestamp) / 60000;
        };

        // We use an iterative approach to find the exact offset for the local time
        // Since offset depends on the time itself (DST), and the time depends on offset.
        let offset = getOffset(localClockUTC, tz);
        // Correct the timestamp to real UTC: UTC = Local - Offset
        const realUTC = localClockUTC - (offset * 60000);
        
        // Final moment in time (UTC Date object)
        return new Date(realUTC);
      } catch (e) {
        console.error('Conversion Error:', e);
        return new Date('Invalid');
      }
    };

    const istSlotDate = convertToIST(date, time, timezone);
    
    if (isNaN(istSlotDate.getTime())) {
      return res.status(400).json({ success: false, error: 'Invalid date or time format provided.' });
    }

    const now = new Date();
    const bufferTime = 90 * 60 * 1000; // 1.5 hours
    
    if (istSlotDate.getTime() < now.getTime() + bufferTime) {
      return res.status(400).json({ success: false, error: 'This slot is no longer available in your timezone.' });
    }

    // Format IST date (YYYY-MM-DD)
    const istDateStr = istSlotDate.toLocaleString('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' });
    // Format IST time (HH:MM AM/PM)
    const istTimeStr = istSlotDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true,
      timeZone: 'Asia/Kolkata' 
    });

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const row = [
      timestamp,
      name,
      email,
      `'${phone}`,
      course,
      referral,
      istDateStr, // Saved as IST
      istTimeStr, // Saved as IST
      'No'
    ];

    // Auth
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

    // Append to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:I`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row],
      },
    });

    // AiSensy Notification
    const aisensyKey = process.env.AISENSY_API_KEY;
    if (aisensyKey) {
      const firstName = name.split(' ')[0];
      const formattedDate = new Date(date).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        timeZone: 'Asia/Kolkata'
      });
      const cleanDestination = (whatsapp || phone).replace(/\D/g, '');

      console.log(`[AiSensy] Sending to ${cleanDestination} for campaign book_call_confirmation`);
      
      try {
        const aiResponse = await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: aisensyKey,
            campaignName: 'final_book_call_confirmation',
            destination: cleanDestination,
            userName: name,
            templateParams: [firstName, course, formattedDate, time, whatsapp || phone],
            attributes: {
              "FirstName": firstName,
              "CourseName": course,
              "ScheduledDate": formattedDate,
              "ScheduledTime": time,
              "WhatsAppNumber": whatsapp || phone
            }
          }),
        });
        
        const aiResult = await aiResponse.json();
        console.log('[AiSensy] Response:', JSON.stringify(aiResult));
      } catch (e) {
        console.error('[AiSensy] Fetch Error:', e);
      }
    }

    return res.status(200).json({ success: true, message: 'Call booked successfully!' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}

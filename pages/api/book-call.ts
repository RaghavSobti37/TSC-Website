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
      // 1. Create a date string that JS can parse
      const localStr = `${dStr} ${tStr}`;
      
      // 2. We use Intl to find the current offset of the provided timezone
      // This is a robust way to handle DST changes as well
      const now = new Date();
      const localFormatter = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
      const istFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
      
      // Parse a dummy date to find the offset difference
      const localParts = localFormatter.formatToParts(now);
      const istParts = istFormatter.formatToParts(now);
      
      const getVal = (parts: any, type: string) => parts.find((p: any) => p.type === type).value;
      
      const lDate = new Date(`${getVal(localParts, 'year')}-${getVal(localParts, 'month')}-${getVal(localParts, 'day')}T${getVal(localParts, 'hour')}:${getVal(localParts, 'minute')}:00`);
      const iDate = new Date(`${getVal(istParts, 'year')}-${getVal(istParts, 'month')}-${getVal(istParts, 'day')}T${getVal(istParts, 'hour')}:${getVal(istParts, 'minute')}:00`);
      
      const offsetDiffMs = iDate.getTime() - lDate.getTime();
      
      // Apply offset to the user's selected slot
      const userSlot = new Date(`${dStr} ${tStr}`);
      const istSlot = new Date(userSlot.getTime() - offsetDiffMs);
      
      return istSlot;
    };

    const istSlotDate = convertToIST(date, time, timezone);
    const now = new Date();
    const bufferTime = 90 * 60 * 1000; // 1.5 hours
    
    if (istSlotDate.getTime() < now.getTime() + bufferTime) {
      return res.status(400).json({ success: false, error: 'This slot is no longer available in your timezone.' });
    }

    const istDateStr = istSlotDate.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-');
    const istTimeStr = istSlotDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

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

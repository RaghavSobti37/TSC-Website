import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';

const SPREADSHEET_ID = '1Yyj8bL8-9lRiJTKhkqQb1X_5Yu02zGCzGPFHln85Pa0';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // 1. Data mapping for Sheet
    const row = [
      timestamp,
      data.name || '',
      data.company || '',
      data.email || '',
      data.phone || '',
      data.collabType || '',
      data.artist || '',
      data.nature || '',
      data.locationTime || '',
      data.scale || '',
      data.logisticsSupport || '',
      data.additionalVision || '',
    ];

    // 2. Append to Google Sheets
    let serviceAccount;
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      serviceAccount = {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/^"|"$/g, ''),
      };
    } else {
      const serviceAccountPath = path.join(process.cwd(), 'google_service_account.json');
      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccountJson = fs.readFileSync(serviceAccountPath, 'utf8');
        serviceAccount = JSON.parse(serviceAccountJson);
      } else {
        throw new Error('Google Service Account credentials missing.');
      }
    }

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    try {
      const HEADER_ROW = [
        'Timestamp', 'Name', 'Company', 'Email', 'Phone', 
        'Collaboration Type', 'Artist/Talent', 'Nature of Project', 
        'When & Where', 'Scale/Reach', 'Logistics Provided?', 'Vision/Details'
      ];
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Inqueries!A1:L1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [HEADER_ROW] },
      });
    } catch (e) {
      console.warn('Header update failed:', e);
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Inqueries!A2',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });

    // 3. Send Email Notification
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #ff6b35; border-bottom: 2px solid #ff6b35; padding-bottom: 10px;">New Artist Enquiry Received</h2>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #333; margin-bottom: 5px;">Contact Information</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Company:</strong> ${data.company}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
        </div>

        <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Collaboration Details</h3>
          <p><strong>Artist:</strong> ${data.artist}</p>
          <p><strong>Type:</strong> ${data.collabType}</p>
          <p><strong>Nature:</strong> ${data.nature}</p>
          <p><strong>When & Where:</strong> ${data.locationTime}</p>
          <p><strong>Scale/Reach:</strong> ${data.scale}</p>
          <p><strong>Logistics Provided:</strong> ${data.logisticsSupport}</p>
        </div>

        <div style="margin: 20px 0;">
          <h3 style="color: #333;">Vision / Extra Details</h3>
          <p style="white-space: pre-wrap;">${data.additionalVision || 'No additional details provided.'}</p>
        </div>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">Sent via TSC Website Automation</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"TSC Website" <${process.env.EMAIL_ADDRESS}>`,
      to: process.env.NOTIFICATION_EMAILS,
      subject: `New Artist Enquiry: ${data.name} for ${data.artist}`,
      html: emailHtml,
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

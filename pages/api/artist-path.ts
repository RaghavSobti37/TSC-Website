import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

// API constants

const SPREADSHEET_ID = '1UQ6zbfazKUCg6tsWCLLIclpvQlWpPj4sugwCtfXmtxA';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  try {
    const { firstName, lastName, ...data } = req.body;

    const fullName = `${firstName || ''} ${lastName || ''}`.trim();

    // We need to write a new row to the sheet with 27 columns (timestamp + 26 fields)
    const row = [
      new Date().toLocaleString(),
      fullName || '',
      data.stageName || '',
      data.place || '',
      data.instagram || '',
      data.spotify || '',
      data.youtube || '',
      data.mobile || '',
      data.email || '',
      data.artistIdentity || '',
      data.trainingDetails || '',
      data.coreSkills || '',
      data.strengthsUniqueness || '',
      data.dailyTime || '',
      data.mentorName || '',
      data.songsReleased || '',
      data.showsPerformed || '',
      data.currentFans || '',
      data.currentSetup || '',
      data.currentlyWorkingOn || '',
      data.dailyRituals || '',
      data.learningNeeds || '',
      data.mentorshipNeeds || '',
      data.curationNeeds || '',
      data.fandomNeeds || '',
      data.aspirationalGoal || '',
      data.anythingElse || '',
    ];

    // Read the service account credentials from env vars or file
    let serviceAccount;
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      serviceAccount = {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        // Replace escaped newlines and remove any surrounding quotes added by Vercel
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/^"|"$/g, ''),
      };
    } else {
      const serviceAccountPath = path.join(process.cwd(), 'google_service_account.json');
      const serviceAccountJson = fs.readFileSync(serviceAccountPath, 'utf8');
      serviceAccount = JSON.parse(serviceAccountJson);
    }

    // Create an auth client
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Create a Sheets API instance
    const sheets = google.sheets({ version: 'v4', auth });

    // Ensure headers exist (optional but good for first time)
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'A1:AA1',
      });
      const firstRow = response.data.values?.[0] || [];
      if (!firstRow.length || firstRow[0] !== 'Timestamp') {
        const HEADER_ROW = [
          'Timestamp', 'FullName', 'StageName', 'Place', 'Instagram', 'Spotify', 'Youtube', 'Mobile', 'Email', 
          'ArtistIdentity', 'TrainingDetails', 'CoreSkills', 'StrengthsUniqueness', 'DailyTime', 'MentorName', 
          'SongsReleased', 'ShowsPerformed', 'CurrentFans', 'CurrentSetup', 'CurrentlyWorkingOn', 'DailyRituals', 
          'LearningNeeds', 'MentorshipNeeds', 'CurationNeeds', 'FandomNeeds', 'AspirationalGoal', 'AnythingElse'
        ];
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: 'A1:AA1',
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [HEADER_ROW] },
        });
      }
    } catch (e) {
      console.warn('Could not check or set headers (ensure service account has access):', e);
    }

    // Append the new row
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'A2', // Start looking from row 2
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row],
      },
    });

    // --- SEND WHATSAPP CONFIRMATION (AiSensy) ---
    try {
      const aisensyKey = process.env.AISENSY_API_KEY;
      const campaignName = process.env.AISENSY_CAMPAIGN_NAME || 'Confirmation TSC';
      
      // Format first name: First letter Caps, others small
      const formattedFirstName = firstName 
        ? firstName.trim().charAt(0).toUpperCase() + firstName.trim().slice(1).toLowerCase() 
        : 'Artist';
      
      if (aisensyKey) {
        console.log(`Attempting to send AiSensy WhatsApp to ${formattedFirstName} at ${data.mobile}`);
        
        const response = await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiKey: aisensyKey,
            campaignName: campaignName,
            destination: (data.mobile || '').replace(/\D/g, ''),
            userName: fullName,
            templateParams: [formattedFirstName]
          }),
        });

        const result = await response.json();
        if (result.success) {
          console.log('AiSensy WhatsApp sent successfully to:', firstName);
        } else {
          console.error('AiSensy API error details:', JSON.stringify(result, null, 2));
        }
      } else {
        console.warn('AISENSY_API_KEY not found, skipping WhatsApp notification.');
        console.log('[MOCK] Sending AiSensy WhatsApp to:', firstName);
      }
    } catch (waError: any) {
      console.error('Error sending AiSensy WhatsApp message:', waError);
    }

    return res.status(200).json({ success: true, message: 'Successfully submitted' });
  } catch (error: any) {
    console.error('API Error:', error.message || error);
    return res.status(500).json({ success: false, error: 'Internal server error: ' + (error.message || 'Unknown error') });
  }
}

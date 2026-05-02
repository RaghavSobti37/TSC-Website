import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const SPREADSHEET_ID = '1UQ6zbfazKUCg6tsWCLLIclpvQlWpPj4sugwCtfXmtxA';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const data = req.body;

    // We need to write a new row to the sheet with 28 columns (timestamp + 27 fields)
    const row = [
      new Date().toLocaleString(),
      data.fullName || '',
      data.instagramId || '',
      data.spotifyId || '',
      data.youtubeChannel || '',
      data.mobile || '',
      data.email || '',
      data.place || '',
      data.artistType || '',
      data.trainingDetails || '',
      data.coreSkills || '',
      data.strengths || '',
      data.uniqueness || '',
      data.dailyTime || '',
      data.mentorName || '',
      data.songsReleased || '',
      data.showsPerformed || '',
      data.currentFans || '',
      data.currentSetup || '',
      data.currentlyWorkingOn || '',
      data.riyaazTime || '',
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
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
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
        range: 'A1:AB1',
      });
      const firstRow = response.data.values?.[0] || [];
      if (!firstRow.length || firstRow[0] !== 'Timestamp') {
        const HEADER_ROW = [
          'Timestamp', 'FullName', 'InstagramId', 'SpotifyId', 'YoutubeChannel', 'Mobile', 'Email', 'Place', 
          'ArtistType', 'TrainingDetails', 'CoreSkills', 'Strengths', 'Uniqueness', 'DailyTime', 'MentorName', 
          'SongsReleased', 'ShowsPerformed', 'CurrentFans', 'CurrentSetup', 'CurrentlyWorkingOn', 'RiyaazTime', 
          'DailyRituals', 'LearningNeeds', 'MentorshipNeeds', 'CurationNeeds', 'FandomNeeds', 'AspirationalGoal', 
          'AnythingElse'
        ];
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: 'A1:AB1',
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

    return res.status(200).json({ success: true, message: 'Successfully submitted' });
  } catch (error: any) {
    console.error('API Error:', error.message || error);
    return res.status(500).json({ success: false, error: 'Internal server error: ' + (error.message || 'Unknown error') });
  }
}

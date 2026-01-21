# Google Sheets Integration - Newsletter Setup

## Overview
Your TSC Website footer is now integrated with a Google Sheet to manage newsletter subscriptions. Subscribers' emails are automatically saved to the sheet with timestamps.

## Setup Completed ✅

### 1. **Dependencies Installed**
   - `googleapis` - Google Sheets API client
   - `google-auth-library` - Authentication for Google services

### 2. **API Endpoint Created**
   - **File**: [pages/api/newsletter.js](pages/api/newsletter.js)
   - **GET `/api/newsletter`** - Fetches all subscribers and count
   - **POST `/api/newsletter`** - Adds a new subscriber email to the sheet

### 3. **Footer Component Updated**
   - **File**: [components/Footer.js](components/Footer.js)
   - Newsletter form now submits emails to Google Sheets
   - Displays current subscriber count
   - Shows success/error feedback messages
   - Prevents duplicate email subscriptions

### 4. **Google Sheet Configuration**
   - **Spreadsheet ID**: `1ekl5xeA3otFGVWDrPx7phM4RFFtxETu0iueEPYSICd0`
   - **Sheet Range**: A:B (Column A = Email, Column B = Subscription Date)
   - **Service Account**: Located at `google_service_account.json` (added to .gitignore)

## How It Works

1. **User enters email** in the footer newsletter form
2. **Frontend validates** the email format
3. **Submits POST request** to `/api/newsletter` with the email
4. **Backend authenticates** with Google Sheets using the service account
5. **Checks for duplicates** to prevent multiple subscriptions
6. **Adds email and timestamp** to the Google Sheet
7. **Updates subscriber count** displayed in the footer

## Testing

To test the integration locally:

```bash
npm run dev
```

Then:
1. Navigate to your website footer
2. Enter a test email in the "Join Our Collective" form
3. Click "Subscribe"
4. Check your Google Sheet - the email should appear with a timestamp

## Google Sheet Format

Your Google Sheet should have this structure:
```
| Email Address          | Subscription Date      |
|------------------------|------------------------|
| subscriber1@email.com  | 1/16/2026, 10:30:45 AM |
| subscriber2@email.com  | 1/16/2026, 11:15:20 AM |
```

## Security Notes

- **Service Account Key** (`google_service_account.json`) is in `.gitignore` - never commit it to version control
- The API validates email format before submission
- Duplicate emails are rejected to prevent spam
- Only read and append permissions are required (no delete/modify on existing data)

## Troubleshooting

### "Failed to fetch subscriber count"
- Check that the service account has access to the sheet
- Verify the SPREADSHEET_ID in the API route matches your sheet

### "Email already subscribed"
- The email already exists in the sheet
- Users must use a different email to subscribe again

### "Invalid email address"
- The email format doesn't match the regex pattern
- Ensure email is in format: `user@domain.com`

## Next Steps (Optional)

1. **Add email notifications**: Integrate with SendGrid/Mailchimp to send confirmation emails
2. **View subscriber analytics**: Add a private dashboard to view subscriber data
3. **Export functionality**: Add ability to export subscribers list as CSV
4. **Segment subscribers**: Add preference fields (interests, frequency, etc.)

## Files Modified/Created

- ✅ Created: [pages/api/newsletter.js](pages/api/newsletter.js)
- ✅ Updated: [components/Footer.js](components/Footer.js)
- ✅ Updated: [package.json](package.json)
- ✅ Updated: [.gitignore](.gitignore)

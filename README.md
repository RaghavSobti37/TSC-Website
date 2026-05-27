# The Shakti Collective

A high-performance, premium website for The Shakti Collective, built with Next.js, Tailwind CSS, and Framer Motion.

## 🚀 Key Features

- **Dynamic Booking System**: Real-time timezone-aware scheduling with country-code detection.
- **Automated CRM**: Seamless integration with Google Sheets for tracking all booked calls.
- **Smart WhatsApp Reminders**: Automated reminders and confirmations via AiSensy integration.
- **Global Timezone Calibration**: Automatically recalibrates all global booking slots to Indian Standard Time (IST) for consistent reminders.
- **Intelligent Buffer**: Enforces a strict 1.5-hour booking buffer relative to the user's local time.

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Google Service Account Credentials (`google_service_account.json`)

## 🔑 Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
SPREADSHEET_ID=your_google_sheet_id
AISENSY_API_KEY=your_aisensy_api_key
# Optional: Service Account Email and Private Key if not using JSON file
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_email
GOOGLE_PRIVATE_KEY=your_private_key
```

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Asset Setup**:
   Place your video assets in the `public/` directory:
   - `hero-video.mp4` (Hero Section)
   - `hero.mp4` (About Section)

3. **Development Server**:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `pages/api/`: 
  - `book-call.ts`: Handles data entry to Google Sheets and sends WhatsApp confirmations.
  - `check-reminders.ts`: Cron-ready API that processes upcoming reminders (IST recalibrated).
- `.github/workflows/`:
  - `send-reminders.yml`: GitHub Action that triggers the reminder API every 10 minutes.
- `pages/book-a-call.tsx`: Timezone-aware frontend booking interface.

## 🌐 Timezone Logic

The system is designed for a global audience. When a user selects their country code:
1. The frontend calculates the 1.5-hour buffer relative to the **user's local time**.
2. The backend recalibrates the chosen slot to **Indian Standard Time (IST)**.
3. All spreadsheet entries and automated reminders are synchronized to IST to ensure the team never misses a call.

## ⚙️ Technologies Used

- **Next.js** - React Framework
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Google Sheets API** - CRM Integration
- **AiSensy API** - WhatsApp Automation
- **GitHub Actions** - Scheduled Reminders

## 🔍 SEO & Google Search Console

To ensure optimal indexing, visibility, and search performance:
1. **Sitemap**: Configured and aligned at `/sitemap.xml` (contains all core static pages, dynamic artist pages, courses, masterclasses, and insights). Old defunct routes have been removed.
2. **Robots.txt**: Served at `/robots.txt`, allowing crawler access for search bots (including AI search engines like OAI-SearchBot and PerplexityBot) and specifying the sitemap link.
3. **Verification**: If site ownership re-verification is required via meta tag, add `<meta name="google-site-verification" content="YOUR_TOKEN" />` within the `<Head>` component of `pages/_app.tsx`.

*Current version: 2.0.2*

## [2026-05-27] Version 2.0.2
- Migrated Book-A-Call backend processing to Taskmaster CRM Webhook.
- Centralized Google Sheets and AiSensy synchronization within CRM core.

# TSC Booking & Reminder System

This document outlines the technical architecture of the automated booking and reminder system integrated into The Shakti Collective website.

## 🧱 Architecture Overview

The system consists of four main components:
1.  **Timezone-Aware Frontend**: Detects user timezone and validates availability.
2.  **API Handler (`book-call`)**: Forwards the booking to **Taskmaster CRM** (`POST /api/webhooks/book-call`). Taskmaster creates/updates the lead, assigns a sales rep (2:1:1), and sends AiSensy messages.
3.  **Taskmaster CRM (primary database)**: MongoDB leads — no HolySheet required for new bookings.
4.  **Google Sheets (optional)**: Legacy backup + `check-reminders` cron. Disable append on Taskmaster with `BOOKED_CALLS_CRM_ONLY=true` when reminders move to Taskmaster.

See Taskmaster `docs/BOOKED_CALLS_CRM_DIRECT.md` for env vars (`TASKMASTER_WEBHOOK_URL`, `BOOK_CALL_WEBHOOK_SECRET`).

---

## 🌐 Timezone Calibration Logic

To maintain consistency for the business team (based in India), all booking slots are recalibrated to **Indian Standard Time (IST)** before being saved.

### How it works:
-   **User Input**: User picks `2026-05-10 10:00 AM` in New York (+1).
-   **Calculation**:
    -   New York Offset (EDT): -4 hours from UTC.
    -   IST Offset: +5.5 hours from UTC.
    -   Shift: User Time + 9.5 hours = IST.
-   **Result**: `2026-05-10 07:30 PM IST` is saved to the sheet.

This ensures that the automated reminder script (which runs on a server) always knows the absolute moment to send the notification without having to guess the user's location.

---

## ⏳ Booking Buffer

We enforce a strict **1.5-hour buffer** to ensure the team has enough notice before a call.
-   The buffer is calculated based on the **user's local timezone**.
-   If it is 3:00 PM in London, the first available slot is 4:30 PM London time.
-   The UI marks expired slots with a red outline and prevents selection.

---

## 🤖 Automation with GitHub Actions

The reminder system is powered by a GitHub Action (`.github/workflows/send-reminders.yml`).
-   **Frequency**: Every 10 minutes.
-   **Reminders**: Sent exactly 10 minutes before the call.
-   **Business Hours Window**: The API will only process reminders between 11:50 AM IST and 07:30 PM IST to save resources and prevent off-hour triggers.

---

## 💬 WhatsApp Integration (AiSensy)

We use the AiSensy API for all communications:
1.  **Confirmation**: Sent immediately after booking using the `final_book_call_confirmation` campaign.
2.  **Reminders**: Sent 10 minutes before the call using the `final_book_call_reminder` campaign.

### Template Variables (`final_book_call_reminder`):
-   `{{1}}`: First Name
-   `{{2}}`: Time Remaining (e.g., "10 minutes")
-   `{{3}}`: Scheduled Time (IST)
-   `{{4}}`: Course Name

---

## 🛠️ Maintenance & Scaling

### Adding new Timezones:
Update the `countryCodes` array in `pages/book-a-call.tsx`. Use standard IANA timezone identifiers (e.g., `Europe/Paris`).

### Changing Reminder Window:
Update `FIRST_SLOT` and `LAST_SLOT` constants in `pages/api/check-reminders.ts`.

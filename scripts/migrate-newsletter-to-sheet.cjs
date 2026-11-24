/**
 * Copy existing newsletter subscribers into the "Newsletter Subscribers" sheet tab.
 * Input: a JSON array of { email, name, source, sourceSite, subscribedAt, unsubscribed, legacyId }
 * (exported read-only from Taskmaster's MongoDB `newslettersubscribers`).
 * Needs GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, TSC_FORMS_SHEET_ID in the env,
 * and the spreadsheet shared with the service account as Editor. Safe to re-run (dedupes by email).
 *
 * Usage: node scripts/migrate-newsletter-to-sheet.cjs subscribers-export.json
 */
const fs = require('fs');
const store = require('../api/_lib/newsletterStore.cjs');

(async () => {
  const list = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  if (!store.isConfigured()) throw new Error('Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY and TSC_FORMS_SHEET_ID first');
  const result = await store.addSubscribers(list);
  console.log(`Newsletter migration: ${result.added} added, ${result.skipped} already present (of ${list.length}).`);
})().catch((err) => { console.error(err.message); process.exit(1); });

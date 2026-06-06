#!/usr/bin/env node
/**
 * Production smoke — direct Taskmaster webhooks + TSC proxy routes.
 * Requires *_WEBHOOK_SECRET env vars (same as Render/Vercel).
 *
 * Usage:
 *   TASKMASTER_BASE_URL=https://taskmaster-jfw0.onrender.com \
 *   TSC_BASE_URL=https://theshakticollective.in \
 *   BOOK_CALL_WEBHOOK_SECRET=... ... \
 *   node scripts/smoke-production.mjs
 */
const TM = (process.env.TASKMASTER_BASE_URL || 'https://taskmaster-jfw0.onrender.com').replace(/\/$/, '');
const TSC = (process.env.TSC_BASE_URL || 'https://theshakticollective.in').replace(/\/$/, '');

const slotDate = new Date(Date.now() + 3 * 60 * 60 * 1000);
const yyyy = slotDate.getFullYear();
const mm = String(slotDate.getMonth() + 1).padStart(2, '0');
const dd = String(slotDate.getDate()).padStart(2, '0');
let hours = slotDate.getHours();
const minutes = String(slotDate.getMinutes()).padStart(2, '0');
const period = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12 || 12;

async function post(url, body, secret) {
  const headers = { 'Content-Type': 'application/json' };
  if (secret) headers['X-Webhook-Secret'] = secret;
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  const parsed = await res.json().catch(() => ({}));
  return { ok: res.ok || res.status === 202, status: res.status, body: parsed };
}

const directTests = [
  ['newsletter', `${TM}/api/webhooks/newsletter`, process.env.NEWSLETTER_WEBHOOK_SECRET, {
    email: 'raghavsobti37@gmail.com', source: 'tsc-footer', sourceSite: 'tsc-website',
  }],
  ['artist-enquiry', `${TM}/api/webhooks/artist-enquiry`, process.env.ARTIST_ENQUIRY_WEBHOOK_SECRET, {
    source: 'tsc-website', name: 'Raghav Raj Sobti', email: 'raghavsobti37@gmail.com',
    phone: '+918591499393', artist: 'YUGM', collaborationType: 'Live performance',
    projectNature: 'Smoke test', whenWhere: 'Mumbai', scaleReach: '100', logisticsSupport: 'N/A', vision: 'Test',
  }],
];

const proxyTests = [
  ['tsc-newsletter', `${TSC}/api/newsletter`, null, { email: 'raghavsobti37@gmail.com' }],
];

console.log('=== Taskmaster direct ===');
let pass = 0;
for (const [name, url, secret, body] of directTests) {
  if (!secret) {
    console.log(`⊘ ${name} skipped (no secret env)`);
    continue;
  }
  const r = await post(url, body, secret);
  console.log(`${r.ok ? '✓' : '✗'} ${name} ${r.status}`, r.body);
  if (r.ok) pass += 1;
}

console.log('\n=== TSC proxy ===');
for (const [name, url, secret, body] of proxyTests) {
  const r = await post(url, body, secret);
  console.log(`${r.ok ? '✓' : '✗'} ${name} ${r.status}`, r.body);
  if (r.ok) pass += 1;
}

console.log(`\n${pass} checks passed`);
process.exit(pass > 0 ? 0 : 1);

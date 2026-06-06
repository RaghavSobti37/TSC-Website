#!/usr/bin/env node
/**
 * Production smoke — direct Taskmaster webhooks + TSC proxy routes.
 * Requires *_WEBHOOK_SECRET env vars (same as Render/Vercel).
 */
const TM = (process.env.TASKMASTER_BASE_URL || 'https://taskmaster-jfw0.onrender.com').replace(/\/$/, '');
const TSC = (process.env.TSC_BASE_URL || 'https://theshakticollective.in').replace(/\/$/, '');
const TEST_EMAIL = 'webhook.smoke@example.com';

async function post(url, body, secret) {
  const headers = { 'Content-Type': 'application/json' };
  if (secret) headers['X-Webhook-Secret'] = secret;
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  const parsed = await res.json().catch(() => ({}));
  return { ok: res.ok || res.status === 202, status: res.status, body: parsed };
}

const directTests = [
  ['newsletter', `${TM}/api/webhooks/newsletter`, process.env.NEWSLETTER_WEBHOOK_SECRET, {
    email: TEST_EMAIL, source: 'tsc-footer', sourceSite: 'tsc-website',
  }],
  ['artist-enquiry', `${TM}/api/webhooks/artist-enquiry`, process.env.ARTIST_ENQUIRY_WEBHOOK_SECRET, {
    source: 'tsc-website', name: 'Webhook Smoke Test', email: TEST_EMAIL,
    phone: '+919876543210', artist: 'YUGM', collaborationType: 'Live performance',
    projectNature: 'Smoke test', whenWhere: 'Mumbai', scaleReach: '100', logisticsSupport: 'N/A', vision: 'Test',
  }],
];

const proxyTests = [
  ['tsc-book-call', `${TSC}/api/book-call`, null, {
    name: 'Webhook Smoke Test', email: TEST_EMAIL, phone: '9876543210', whatsapp: '9876543210',
    course: 'Prod Smoke', date: '2026-06-07', time: '04:00 PM', timezone: 'Asia/Kolkata',
  }],
  ['tsc-newsletter', `${TSC}/api/newsletter`, null, { email: TEST_EMAIL }],
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

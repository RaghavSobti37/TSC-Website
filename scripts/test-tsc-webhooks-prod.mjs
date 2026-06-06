#!/usr/bin/env node
const TSC = (process.env.TSC_BASE_URL || 'https://theshakticollective.in').replace(/\/$/, '');
const slotDate = new Date(Date.now() + 3 * 60 * 60 * 1000);
const yyyy = slotDate.getFullYear();
const mm = String(slotDate.getMonth() + 1).padStart(2, '0');
const dd = String(slotDate.getDate()).padStart(2, '0');
let hours = slotDate.getHours();
const minutes = String(slotDate.getMinutes()).padStart(2, '0');
const period = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12 || 12;

const tests = [
  ['book-call', '/api/book-call', {
    name: 'Webhook Smoke Test', email: 'webhook.smoke@example.com', phone: '9876543210',
    whatsapp: '9876543210', course: 'Prod Smoke', date: `${yyyy}-${mm}-${dd}`,
    time: `${hours}:${minutes} ${period}`, timezone: 'Asia/Kolkata',
  }],
  ['query', '/api/query', {
    name: 'Webhook Smoke', email: 'webhook.smoke@example.com', phone: '9876543210',
    company: 'TSC', collabType: 'Live', artist: 'YUGM', nature: 'Test',
    locationTime: 'Mumbai', scale: '100', logisticsSupport: 'N/A', additionalVision: 'Smoke',
  }],
  ['artist-path', '/api/artist-path', {
    firstName: 'Webhook', lastName: 'Smoke', email: 'webhook.smoke@example.com',
    mobile: '9876543210', stageName: 'Test',
  }],
  ['newsletter', '/api/newsletter', { email: 'webhook.smoke@example.com' }],
  ['reviews POST', '/api/reviews', {
    firstName: 'Webhook', lastName: 'Smoke', registeredMobile: '9876543210',
    registeredEmail: 'webhook.smoke@example.com', oneLineExperience: 'Smoke test',
    improvementSuggestion: 'More demos', rating: 5,
  }],
  ['reviews GET', '/api/reviews', null, 'GET'],
];

async function runOne(name, path, body, method = 'POST') {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body && method !== 'GET') opts.body = JSON.stringify(body);
  const res = await fetch(`${TSC}${path}`, opts);
  const text = await res.text();
  let parsed;
  try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }
  const ok = res.ok && (parsed.success !== false || name.includes('GET'));
  console.log(`${ok ? '✓' : '✗'} ${name} → ${res.status}`, JSON.stringify(parsed).slice(0, 200));
  return ok;
}

console.log(`TSC prod smoke: ${TSC}`);
let pass = 0;
for (const t of tests) {
  if (await runOne(...t)) pass += 1;
}
console.log(`\n${pass}/${tests.length} passed`);
process.exit(pass === tests.length ? 0 : 1);

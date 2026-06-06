#!/usr/bin/env node
/**
 * POST all TSC /api/* routes (proxies to Taskmaster).
 * Usage: node scripts/test-tsc-webhooks.mjs
 * Env: TSC_BASE_URL (default http://127.0.0.1:3000)
 */
const BASE = (process.env.TSC_BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');

const slotDate = new Date(Date.now() + 3 * 60 * 60 * 1000);
const yyyy = slotDate.getFullYear();
const mm = String(slotDate.getMonth() + 1).padStart(2, '0');
const dd = String(slotDate.getDate()).padStart(2, '0');
let hours = slotDate.getHours();
const minutes = String(slotDate.getMinutes()).padStart(2, '0');
const period = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12 || 12;

const tests = [
  {
    name: 'book-call',
    path: '/api/book-call',
    body: {
      name: 'Raghav Raj Sobti',
      email: 'raghavsobti37@gmail.com',
      phone: '8591499393',
      whatsapp: '8591499393',
      course: 'TSC Proxy Smoke',
      date: `${yyyy}-${mm}-${dd}`,
      time: `${hours}:${minutes} ${period}`,
      timezone: 'Asia/Kolkata',
    },
  },
  {
    name: 'query',
    path: '/api/query',
    body: {
      name: 'Raghav Raj Sobti',
      company: 'TSC Smoke',
      email: 'raghavsobti37@gmail.com',
      phone: '+918591499393',
      collabType: 'Live performance',
      artist: 'YUGM',
      nature: 'Festival',
      locationTime: 'Delhi, Dec 2026',
      scale: '1000+',
      logisticsSupport: 'Travel',
      additionalVision: 'High energy set',
    },
  },
  {
    name: 'artist-path',
    path: '/api/artist-path',
    body: {
      firstName: 'Raghav',
      lastName: 'Sobti',
      stageName: 'Proxy Smoke',
      place: 'Mumbai',
      mobile: '8591499393',
      email: 'raghavsobti37@gmail.com',
      artistIdentity: 'Producer',
    },
  },
  {
    name: 'newsletter',
    path: '/api/newsletter',
    body: { email: 'raghavsobti37@gmail.com' },
  },
  {
    name: 'reviews',
    path: '/api/reviews',
    body: {
      firstName: 'Raghav',
      lastName: 'Sobti',
      registeredMobile: '8591499393',
      registeredEmail: 'raghavsobti37@gmail.com',
      oneLineExperience: 'Proxy smoke review',
      improvementSuggestion: 'More examples',
      weightedRating: 5,
      rating: 5,
    },
  },
];

async function runOne(test) {
  const res = await fetch(`${BASE}${test.path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(test.body),
  });
  const body = await res.json().catch(() => ({}));
  const ok = res.ok && (body.success !== false);
  console.log(`${ok ? '✓' : '✗'} ${test.name} → ${res.status}`, body);
  return ok;
}

let passed = 0;
console.log(`TSC proxy smoke: ${BASE}`);
for (const test of tests) {
  if (await runOne(test)) passed += 1;
}
console.log(`\n${passed}/${tests.length} passed`);
process.exit(passed === tests.length ? 0 : 1);

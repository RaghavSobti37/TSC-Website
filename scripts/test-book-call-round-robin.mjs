#!/usr/bin/env node
/**
 * Verify book-a-call round-robin on production (TSC proxy → Taskmaster).
 * Requires deployed code that returns assignedRepName in API response.
 *
 * Usage: node scripts/test-book-call-round-robin.mjs
 * Env: TSC_BASE_URL (default https://theshakticollective.in)
 */
const TSC = (process.env.TSC_BASE_URL || 'https://theshakticollective.in').replace(/\/$/, '');
const RUNS = Number(process.env.ROUND_ROBIN_RUNS || 3);

function slotPayload(run) {
  const slotDate = new Date(Date.now() + (3 + run) * 60 * 60 * 1000);
  const yyyy = slotDate.getFullYear();
  const mm = String(slotDate.getMonth() + 1).padStart(2, '0');
  const dd = String(slotDate.getDate()).padStart(2, '0');
  let hours = slotDate.getHours();
  const minutes = String(slotDate.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return {
    name: `Round Robin Test ${run}`,
    email: `roundrobin.test.${Date.now()}.${run}@example.com`,
    phone: `9876543${String(run).padStart(3, '0')}`,
    whatsapp: `9876543${String(run).padStart(3, '0')}`,
    course: 'Round Robin Smoke',
    date: `${yyyy}-${mm}-${dd}`,
    time: `${hours}:${minutes} ${period}`,
    timezone: 'Asia/Kolkata',
  };
}

async function bookOnce(run) {
  const res = await fetch(`${TSC}/api/book-call`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(slotPayload(run)),
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

console.log(`Round-robin smoke: ${TSC} (${RUNS} bookings)\n`);

const assignees = [];
for (let i = 1; i <= RUNS; i += 1) {
  const { ok, status, body } = await bookOnce(i);
  const rep = body.assignedRepName || body.assignedRepId || '(missing — deploy Taskmaster + TSC)';
  assignees.push(rep);
  console.log(`${ok ? '✓' : '✗'} run ${i} → ${status} rep=${rep} leadId=${body.leadId || '—'}`);
  if (!ok) {
    console.error('  error:', body.error || body);
    process.exit(1);
  }
  await new Promise((r) => setTimeout(r, 800));
}

const unique = new Set(assignees.filter((a) => a && a !== '(missing — deploy Taskmaster + TSC)'));
console.log(`\nUnique assignees: ${unique.size} → ${[...unique].join(', ') || 'n/a'}`);

if (assignees.some((a) => String(a).includes('missing'))) {
  console.warn('\nDeploy latest Taskmaster + TSC to see assignedRepName in responses.');
  process.exit(0);
}

if (unique.size < 2 && RUNS >= 3) {
  console.warn('\nWarning: only one rep assigned — sales dept may have one user, or round-robin not deployed yet.');
}

process.exit(0);

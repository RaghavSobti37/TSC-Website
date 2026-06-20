#!/usr/bin/env node
/**
 * Compare required TSC ↔ Taskmaster integration env var NAMES on Vercel.
 * Does not print secret values. Run from TSC-Website after `vercel link`.
 */
import { execSync } from 'node:child_process';

const TASKMASTER_HOST = 'taskmaster-jfw0.onrender.com';

const REQUIRED = {
  Production: [
    'TASKMASTER_WEBHOOK_URL',
    'TASKMASTER_ARTIST_ENQUIRY_WEBHOOK_URL',
    'TASKMASTER_ARTIST_PATH_WEBHOOK_URL',
    'TASKMASTER_NEWSLETTER_WEBHOOK_URL',
    'TASKMASTER_MASTERCLASS_REVIEW_WEBHOOK_URL',
    'BOOK_CALL_WEBHOOK_SECRET',
    'ARTIST_ENQUIRY_WEBHOOK_SECRET',
    'ARTIST_PATH_WEBHOOK_SECRET',
    'NEWSLETTER_WEBHOOK_SECRET',
    'MASTERCLASS_REVIEW_WEBHOOK_SECRET',
  ],
  Preview: [
    'TASKMASTER_WEBHOOK_URL',
    'TASKMASTER_ARTIST_ENQUIRY_WEBHOOK_URL',
    'BOOK_CALL_WEBHOOK_SECRET',
    'ARTIST_ENQUIRY_WEBHOOK_SECRET',
  ],
};

function parseEnvList(output) {
  const rows = new Map();
  for (const line of output.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('name ') || trimmed.startsWith('Common ')) continue;
    const name = trimmed.split(/\s+/)[0];
    if (!name || name === 'name') continue;
    const envMatch = trimmed.match(/\b(Production|Preview|Development)(?:,\s*(?:Production|Preview|Development))*\b/g);
    if (!envMatch) continue;
    const envs = new Set();
    for (const chunk of envMatch) {
      chunk.split(',').forEach((e) => envs.add(e.trim()));
    }
    rows.set(name, envs);
  }
  return rows;
}

let raw;
try {
  raw = execSync('npx vercel env ls', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
} catch (e) {
  console.error('Run from linked TSC-Website: npx vercel link --project tsc-website');
  console.error(e.stderr?.toString() || e.message);
  process.exit(1);
}

const found = parseEnvList(raw);
let failed = 0;

console.log('TSC-Website Vercel env audit (names only)\n');

for (const [env, keys] of Object.entries(REQUIRED)) {
  console.log(`[${env}]`);
  for (const key of keys) {
    const envs = found.get(key);
    const ok = envs?.has(env);
    console.log(`  ${ok ? '✓' : '✗'} ${key}${envs ? ` (on: ${[...envs].join(', ')})` : ''}`);
    if (!ok) failed += 1;
  }
  console.log('');
}

const urlKeys = [
  'TASKMASTER_WEBHOOK_URL',
  'TASKMASTER_ARTIST_ENQUIRY_WEBHOOK_URL',
  'TASKMASTER_ARTIST_PATH_WEBHOOK_URL',
];
console.log(`Expected Taskmaster host in URL vars: ${TASKMASTER_HOST}`);
console.log('(Pull env locally to verify URL values if needed.)\n');

console.log(failed ? `${failed} gap(s) — add missing vars in Vercel dashboard.` : 'All required var names present.');
process.exit(failed ? 1 : 0);

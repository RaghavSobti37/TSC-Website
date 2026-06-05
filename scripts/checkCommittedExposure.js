#!/usr/bin/env node
/**
 * Scan tracked files for hardcoded secrets / PII that must not be committed.
 * Usage: npm run audit:exposure
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const EXT_SCAN = new Set(['.md', '.example', '.js', '.jsx', '.json', '.yml', '.yaml', '.mjs', '.ts', '.tsx']);

const SKIP_FILES = new Set(['scripts/checkCommittedExposure.js']);

const BLOCKED_LITERALS = [
  'mongodb+srv://',
  '-----BEGIN PRIVATE KEY-----',
  '-----BEGIN RSA PRIVATE KEY-----',
  'whsec_',
  'AIzaSy',
];

const PATTERNS = [
  { id: 'mongodb-srv', re: /mongodb\+srv:\/\/[^\s'"`]+/gi, label: 'MongoDB Atlas URI' },
  { id: 'private-key', re: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/g, label: 'Private key PEM' },
];

function getTrackedFiles() {
  const out = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' });
  return out
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean);
}

function scanFile(relPath) {
  const ext = path.extname(relPath);
  if (!EXT_SCAN.has(ext)) return [];
  if (SKIP_FILES.has(relPath)) return [];

  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return [];

  const content = fs.readFileSync(full, 'utf8');
  const violations = [];

  for (const literal of BLOCKED_LITERALS) {
    if (content.includes(literal)) {
      violations.push({ file: relPath, label: `Blocked literal: ${literal}` });
    }
  }

  for (const { re, label } of PATTERNS) {
    if (re.test(content)) {
      violations.push({ file: relPath, label });
    }
  }

  return violations;
}

const violations = getTrackedFiles().flatMap(scanFile);

if (violations.length) {
  console.error('Exposure audit failed:');
  for (const v of violations) {
    console.error(`  ${v.file}: ${v.label}`);
  }
  process.exit(1);
}

console.log('Exposure audit passed.');
process.exit(0);

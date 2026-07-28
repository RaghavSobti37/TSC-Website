#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const v = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const rewrites = (v.rewrites || []).filter((r) => r.source && r.destination);
const redirects = v.redirects || [];
const pages = fs
  .readdirSync(path.join(root, 'public', 'pages'))
  .filter((f) => f.endsWith('.html'))
  .map((f) => f.replace(/\.html$/, ''));

const rewriteSources = new Set(rewrites.map((r) => r.source));
const redirectMap = Object.fromEntries(redirects.map((r) => [r.source, r.destination]));

const missingExact = [];
for (const slug of pages) {
  if (slug === 'home') continue;
  const exact = `/${slug}`;
  if (!rewriteSources.has(exact)) missingExact.push(slug);
}

console.log(JSON.stringify({
  pageCount: pages.length,
  pages,
  missingExactRewrite: missingExact,
  redirectCount: redirects.length,
  sampleRedirects: redirects.slice(0, 5),
}, null, 2));

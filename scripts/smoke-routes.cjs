#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const http = require('http');

const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, 'public/pages/routes.manifest.json'), 'utf8')
);
const port = Number(process.env.PORT || 3000);
const argRoutes = process.argv.includes('--routes')
  ? process.argv[process.argv.indexOf('--routes') + 1].split(',').map((s) => s.trim()).filter(Boolean)
  : null;
const routes = argRoutes || manifest.allRoutes || [];

function get(pathname) {
  return new Promise((resolve) => {
    const req = http.get({ hostname: '127.0.0.1', port, path: pathname, timeout: 10000 }, (res) => {
      res.resume();
      resolve({ pathname, status: res.statusCode });
    });
    req.on('error', (err) => resolve({ pathname, status: 0, error: err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ pathname, status: 0, error: 'timeout' });
    });
  });
}

(async () => {
  const results = [];
  for (const route of routes) {
    results.push(await get(route));
  }
  const failed = results.filter((r) => r.status !== 200);
  for (const r of results) {
    console.log(`${r.status}\t${r.pathname}${r.error ? `\t${r.error}` : ''}`);
  }
  console.log(`OK ${results.length - failed.length}/${results.length}`);
  process.exit(failed.length ? 1 : 0);
})();

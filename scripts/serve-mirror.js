const fs = require('fs');
const http = require('http');
const path = require('path');

const publicDir = path.resolve(__dirname, '..', 'public');
const port = Number(process.argv[2] || 3100);

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
};

function safePart(value, fallback) {
  return String(value || fallback).replace(/[^a-zA-Z0-9._-]+/g, '_');
}

function requestPath(url) {
  const pathname = decodeURIComponent(url.pathname);
  if (pathname === '/api/disabled-telemetry' || pathname === '/assets/mirror/disabled-telemetry' || pathname.startsWith('/_api/')) {
    return { json: '{}' };
  }

  if (pathname === '/assets/mirror/siteassets.parastorage.com/pages/pages/thunderbolt' && url.search) {
    const file = [
      safePart(url.searchParams.get('module'), 'module'),
      safePart(url.searchParams.get('pageId'), 'page'),
      safePart(url.searchParams.get('formFactor') || url.searchParams.get('deviceType'), 'responsive'),
      safePart(url.searchParams.get('fileId'), 'file'),
    ].join('--');
    return `/assets/mirror/siteassets.parastorage.com/pages/pages/thunderbolt/${file}.json`;
  }

  const mediaMatch = pathname.match(/^\/assets\/mirror\/static\.wixstatic\.com\/media\/([^/]+)\/v1\//);
  if (mediaMatch) return `/assets/mirror/static.wixstatic.com/original-media/${mediaMatch[1]}`;
  if (pathname.endsWith('/')) return `${pathname}index.html`;
  if (!path.extname(pathname)) return `${pathname}/index.html`;
  return pathname;
}

http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || `127.0.0.1:${port}`}`);
  const resolved = requestPath(url);
  if (resolved.json !== undefined) {
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(resolved.json);
    return;
  }

  const absolutePath = path.resolve(publicDir, `.${resolved}`);
  if (absolutePath !== publicDir && !absolutePath.startsWith(`${publicDir}${path.sep}`)) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
    response.writeHead(404).end('Not found');
    return;
  }

  const headers = {
    'Content-Type': mimeTypes[path.extname(absolutePath).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  };
  const stat = fs.statSync(absolutePath);
  const range = request.headers.range;
  if (range && headers['Content-Type'] === 'video/mp4') {
    const match = range.match(/bytes=(\d*)-(\d*)/);
    const start = match && match[1] ? Number(match[1]) : 0;
    const end = match && match[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;
    response.writeHead(206, {
      ...headers,
      'Accept-Ranges': 'bytes',
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Content-Length': end - start + 1,
    });
    fs.createReadStream(absolutePath, { start, end }).pipe(response);
    return;
  }
  response.writeHead(200, { ...headers, 'Content-Length': stat.size });
  fs.createReadStream(absolutePath).pipe(response);
}).listen(port, '127.0.0.1', () => {
  console.log(`Mirror server ready at http://127.0.0.1:${port}`);
});

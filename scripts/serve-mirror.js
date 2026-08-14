const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');

const publicDir = path.resolve(__dirname, '..', 'public');
const projectDir = path.resolve(__dirname, '..');
const port = Number(process.argv[2] || 3100);
const apiRoutes = new Map([
  ['/api/book-call', '../api/book-call.js'],
  ['/api/query', '../api/query.js'],
  ['/api/artist-path', '../api/artist-path.js'],
  ['/api/leads', '../api/leads.js'],
  ['/api/newsletter', '../api/newsletter.js'],
  ['/api/reviews', '../api/reviews.js'],
  ['/api/reviews02', '../api/reviews02.js'],
]);

function loadLocalEnv() {
  for (const file of ['.env.local', '.env']) {
    const envPath = path.join(projectDir, file);
    if (!fs.existsSync(envPath)) continue;
    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}

loadLocalEnv();
const pageRoutes = new Map([
  ['/', '/pages/home.html'],
  ['/about', '/pages/about.html'],
  ['/work', '/pages/work.html'],
  ['/artists', '/pages/artists.html'],
  ['/artist-path', '/pages/artist-path.html'],
  ['/learn-with-tsc', '/pages/learn-with-tsc.html'],
  ['/films', '/pages/films.html'],
  ['/resources', '/pages/resources.html'],
  ['/academy', '/pages/academy.html'],
  ['/affiliate', '/pages/affiliate.html'],
]);

const routeManifestPath = path.join(publicDir, 'pages', 'routes.manifest.json');
if (fs.existsSync(routeManifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(routeManifestPath, 'utf8'));
  const pages = [...(manifest.primaryPages || []), ...(manifest.subpages || [])];
  for (const page of pages) {
    if (page.route && page.file) pageRoutes.set(page.route, `/pages/${page.file}`);
  }
  for (const alias of manifest.aliases || []) {
    const target = pages.find(page => page.route === alias.route);
    if (alias.alias && target?.file) pageRoutes.set(alias.alias, `/pages/${target.file}`);
  }
}

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
  if (pageRoutes.has(pathname)) return pageRoutes.get(pathname);
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

  const mediaMatch = pathname.match(/^\/assets\/mirror\/static\.wixstatic\.com\/media\/(.+)$/);
  if (mediaMatch && pathname.includes('/v1/')) {
    const asset = pathname.match(/^\/assets\/mirror\/static\.wixstatic\.com\/media\/([^/]+)\/v1\//);
    return {
      proxy: `https://static.wixstatic.com/media/${mediaMatch[1]}${url.search}`,
      fallback: asset ? `/assets/mirror/static.wixstatic.com/original-media/${asset[1]}` : null,
    };
  }
  // Bare media uri (e.g. wix-bg-image tiled backgrounds resolve to the uri
  // without a /v1/ transform path): proxy the original from the CDN like the
  // /v1/ variants, falling back to the mirrored original-media copy.
  if (mediaMatch && !pathname.includes('/v1/')) {
    return {
      proxy: `https://static.wixstatic.com/media/${mediaMatch[1]}${url.search}`,
      fallback: `/assets/mirror/static.wixstatic.com/original-media/${mediaMatch[1]}`,
    };
  }
  if (pathname.endsWith('/')) return `${pathname}index.html`;
  if (!path.extname(pathname)) return `${pathname}/index.html`;
  return pathname;
}

function sendFile(absolutePath, request, response) {
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
}

function handleApi(request, response, pathname) {
  const route = apiRoutes.get(pathname);
  if (!route) return false;
  try {
    const handler = require(path.resolve(__dirname, route));
    handler(request, response);
  } catch (error) {
    console.error('[serve-mirror api]', pathname, error.message || error);
    response.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(JSON.stringify({ success: false, error: 'Local API handler failed' }));
  }
  return true;
}

function proxyWixMedia(proxyUrl, fallbackPath, request, response, hops) {
  if ((hops || 0) > 4) {
    if (fallbackPath) return sendFile(path.resolve(publicDir, `.${fallbackPath}`), request, response);
    response.writeHead(502).end('Too many redirects');
    return;
  }
  https.get(proxyUrl, { headers: { 'User-Agent': 'Mozilla/5.0 TSC-mirror' } }, (up) => {
    const loc = up.headers.location;
    if (up.statusCode >= 300 && up.statusCode < 400 && loc) {
      up.resume();
      const next = loc.startsWith('http') ? loc : new URL(loc, proxyUrl).href;
      proxyWixMedia(next, fallbackPath, request, response, (hops || 0) + 1);
      return;
    }
    if (up.statusCode !== 200) {
      up.resume();
      if (fallbackPath) return sendFile(path.resolve(publicDir, `.${fallbackPath}`), request, response);
      response.writeHead(up.statusCode || 502).end('Upstream image error');
      return;
    }
    response.writeHead(200, {
      'Content-Type': up.headers['content-type'] || 'image/jpeg',
      'Cache-Control': 'no-store',
    });
    up.pipe(response);
  }).on('error', () => {
    if (fallbackPath) return sendFile(path.resolve(publicDir, `.${fallbackPath}`), request, response);
    response.writeHead(502).end('Upstream image error');
  });
}

http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || `127.0.0.1:${port}`}`);
  if (handleApi(request, response, url.pathname)) return;
  const resolved = requestPath(url);
  if (resolved.json !== undefined) {
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(resolved.json);
    return;
  }
  if (resolved.proxy) {
    proxyWixMedia(resolved.proxy, resolved.fallback, request, response, 0);
    return;
  }

  sendFile(path.resolve(publicDir, `.${resolved}`), request, response);
}).listen(port, '127.0.0.1', () => {
  console.log(`Mirror server ready at http://127.0.0.1:${port}`);
});

'use strict';

// Minimal local mock of the Taskmaster webhook so form submissions can be
// verified end-to-end without hitting the real CRM. Accepts any POST and
// returns a success envelope.
// Usage: node scripts/mock-taskmaster.cjs [port]  (default 5001)

const http = require('http');

const port = Number(process.argv[2] || 5001);

http
  .createServer((req, res) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      let parsed = {};
      try {
        parsed = JSON.parse(body || '{}');
      } catch (_) {
        // ignore malformed bodies
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: true,
          message: `mock ok (${req.url})`,
          leadId: 'mock-lead-1',
          received: parsed,
        })
      );
    });
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`mock taskmaster listening on http://127.0.0.1:${port}`);
  });

const http = require('http');
const net = require('net');

const TARGET_HOST = 'localhost';
const TARGET_PORT = 3001;
const PROXY_PORT = 8080;

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Forward the request to the target server
  const options = {
    hostname: TARGET_HOST,
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    // Forward status code
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    // Forward response body
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Error forwarding request:', err);
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Bad Gateway - Target server unavailable');
  });

  // Forward request body
  req.pipe(proxyReq);
});

// Handle WebSocket upgrades for Next.js hot reload
server.on('upgrade', (req, socket, head) => {
  const proxySocket = net.createConnection(TARGET_PORT, TARGET_HOST, () => {
    // Send upgrade request to target
    const upgradeRequest =
      `${req.method} ${req.url} HTTP/${req.httpVersion}\r\n` +
      Object.entries(req.headers)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\r\n') +
      '\r\n\r\n';

    proxySocket.write(upgradeRequest);
    proxySocket.write(head);

    // Pipe bidirectional traffic
    socket.pipe(proxySocket);
    proxySocket.pipe(socket);
  });

  proxySocket.on('error', (err) => {
    console.error('WebSocket proxy error:', err);
    socket.destroy();
  });
});

server.listen(PROXY_PORT, '0.0.0.0', () => {
  console.log(`\n✅ Proxy server running!\n`);
  console.log(`📱 Share this URL with your team:\n`);
  console.log(`   http://192.168.29.11:${PROXY_PORT}\n`);
  console.log(`🔄 Connected to: http://localhost:${TARGET_PORT}`);
  console.log(`\nPress Ctrl+C to stop\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PROXY_PORT} is already in use`);
    console.error(`Run: netstat -ano | findstr :${PROXY_PORT}`);
    process.exit(1);
  }
  console.error('Server error:', err);
});

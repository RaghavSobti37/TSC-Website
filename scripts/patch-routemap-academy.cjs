const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', 'public', 'js', 'pages');

const INSERT = `  "/blank-3-1": "/academy",
  "/learn-with-tsc": "/academy",
  "/academy/learn-with-tsc": "/academy",
`;

for (const name of fs.readdirSync(root)) {
  if (!name.endsWith('.js')) continue;
  const p = path.join(root, name);
  let s = fs.readFileSync(p, 'utf8');
  if (!s.includes('var routeMap')) continue;
  if (s.includes('"/learn-with-tsc": "/academy"')) continue;
  // Insert after routeMap opening brace
  const next = s.replace(/var routeMap = \{\r?\n/, (m) => m + INSERT);
  if (next === s) {
    console.log('no routeMap match', name);
    continue;
  }
  fs.writeFileSync(p, next);
  console.log('routeMap', name);
}

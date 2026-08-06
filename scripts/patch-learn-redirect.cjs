const fs = require('fs');
const path = require('path');

const REDIR = `<script data-tsc-canonical-redirect>(function(){var p=(location.pathname||'').replace(/\\/+$/,'')||'/';if(/learn-with-tsc/i.test(p))location.replace('/academy'+location.search+location.hash);})();</script>
`;

function patchHtml(file) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes('data-tsc-canonical-redirect')) return false;
  if (!/<head[^>]*>/i.test(s)) return false;
  s = s.replace(/<head([^>]*)>/i, '<head$1>\n' + REDIR);
  fs.writeFileSync(file, s);
  return true;
}

const root = path.join(__dirname, '..', 'public');
const targets = [
  path.join(root, 'pages', 'learn-with-tsc.html'),
  path.join(root, 'learn-with-tsc', 'index.html')
];
for (const t of targets) {
  if (!fs.existsSync(t)) {
    console.log('missing', t);
    continue;
  }
  console.log(patchHtml(t) ? 'patched' : 'skip', path.relative(root, t));
}

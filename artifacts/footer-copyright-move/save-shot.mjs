import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = process.argv[2];
const j = JSON.parse(fs.readFileSync(src, 'utf8'));
const b64 = j.data || j.result?.data;
if (!b64) {
  console.error('no data', Object.keys(j));
  process.exit(1);
}
const out = path.join(__dirname, 'footer-full.png');
fs.writeFileSync(out, Buffer.from(b64, 'base64'));
console.log('wrote', out, Buffer.from(b64, 'base64').length);

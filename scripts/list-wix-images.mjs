import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const html = fs.readFileSync(process.env.WIX_HTML || path.join(process.env.TEMP, 'wix-hdc-full.html'), 'utf8');
const uris = [...new Set([...html.matchAll(/&quot;uri&quot;:&quot;(19f989_[^&]+)&quot;/g)].map((m) => m[1]))];
console.log(uris.join('\n'));

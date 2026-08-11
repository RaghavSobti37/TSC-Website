import fs from 'fs';
const h = fs.readFileSync('public/films/index.html', 'utf8');
const scripts = [...h.matchAll(/src="([^"]+)"/g)].map((m) => m[1]).filter((s) => /tsc|content|component/i.test(s));
console.log('scripts', scripts);
const css = [...h.matchAll(/href="([^"]+\.css[^"]*)"/g)].map((m) => m[1]).filter((s) => /tsc|responsive|films|mobile/i.test(s));
console.log('css', css);
console.log('has tsc-responsive string', h.includes('tsc-responsive'));
console.log('has content-replacements', h.includes('content-replacements'));

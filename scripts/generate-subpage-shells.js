const fs = require('fs');
const path = require('path');
const { injectAllPages } = require('./inject-responsive-assets');

const publicDir = path.join(__dirname, '..', 'public');
const pagesDir = path.join(publicDir, 'pages');

const basePage = 'home';

const subpages = [
  { title: 'MBA', route: '/mba', aliases: ['/blank-7', '/work/mba'] },
  { title: 'Havells mYOUsic', route: '/havells-myousic', aliases: ['/work2', '/work/havells-myousic'] },
  { title: 'Insta Music League', route: '/insta-music-league', aliases: ['/work3', '/work/insta-music-league'] },
  { title: 'The Young Gunns', route: '/young-gunns', aliases: ['/work0', '/work/young-gunns'] },
  { title: 'Harshad Duhita', route: '/harshad-duhita', aliases: ['/blank-10', '/artists/harshad-duhita'] },
  { title: 'Mohit Shankar', route: '/mohit-shankar', aliases: ['/artists/mohit-shankar'] },
  { title: 'Roots of Hindustani Classical', route: '/roots-of-hindustani-classical', aliases: ['/blank-9-1', '/about-9-1', '/academy/roots-of-hindustani-classical'] },
  { title: 'The HeART of Composition', route: '/the-heart-of-composition', aliases: ['/blank-9', '/about-9', '/academy/the-heart-of-composition'] },
  { title: 'A-Z of Music Production', route: '/music-production', aliases: ['/academy/music-production', '/courses/music-production'] },
  { title: 'All Courses Bundle', route: '/course-bundle', aliases: ['/academy/course-bundle', '/courses/course-bundle'] },
  { title: 'How Do I Start Making Music If I Have No Experience?', route: '/start-making-music', aliases: ['/blog-1', '/blank-13', '/resources/blog-1', '/resources/start-making-music'] },
  { title: 'YUGM', route: '/yugm', aliases: ['/blank-10-1', '/work0-1', '/artists/yugm'] },
  { title: 'Mahaprbhu', route: '/mahaprbhu', aliases: ['/blank-12-1-1', '/work2-1-1', '/films/mahaprbhu'] },
  { title: 'Mahavatar Narsimha', route: '/mahavatar-narsimha', aliases: ['/blank-12', '/films/mahavatar-narsimha'] },
  { title: 'Hanuman ansh', route: '/hanuman-ansh', aliases: ['/blank-12-1', '/work2-1', '/films/hanuman-ansh'] },
  { title: 'Mahavatar Narsimha Impact Report', route: '/mahavatar-narsimha-impact', aliases: ['/films/mahavatar-narsimha-impact'] },
  { title: 'Hanuman Ansh Impact Report', route: '/hanuman-ansh-impact', aliases: ['/films/hanuman-ansh-impact'] },
  { title: 'Mahaprabhu Jagannath Impact Report', route: '/mahaprabhu-jagannath-impact', aliases: ['/mahaprbhu-impact', '/films/mahaprbhu-impact', '/films/mahaprabhu-jagannath-impact'] },
  { title: 'Kalki Impact Report', route: '/kalki-impact', aliases: ['/films/kalki-impact'] },
  { title: 'The Artist Release Playbook', route: '/artist-release-playbook', aliases: ['/blog-3', '/blank-13-1-1', '/work3-1-1', '/resources/blog-3', '/resources/artist-release-playbook'] },
  { title: 'Is an Online Music Course Worth It for Beginners?', route: '/online-music-course-worth-it', aliases: ['/blog-2', '/blank-13-1', '/work3-1', '/resources/blog-2', '/resources/online-music-course-worth-it'] },
  { title: 'Indian Culture Mainstream Forms', route: '/from-bhajan-to-clubbing', aliases: ['/resources/from-bhajan-to-clubbing'] },
  { title: 'You Released a Song. Now What?', route: '/you-released-a-song-now-what', aliases: ['/resources/you-released-a-song-now-what'] },
  { title: 'How I Curate Music With Independent Artists', route: '/how-i-curate-music-with-independent-artists', aliases: ['/resources/how-i-curate-music-with-independent-artists'] },
  { title: 'Collab Q', route: '/collab-query', aliases: ['/blank-6', '/forms/collab-query'] },
  { title: 'Kalki', route: '/kalki', aliases: ['/blank-12-1-1-1', '/work2-1-1-1', '/films/kalki'] },
  { title: 'Book An Artist', route: '/book-an-artist', aliases: ['/blank-8-1', '/about-8-1', '/query', '/forms/book-an-artist'] },
  { title: 'Artist Path Query', route: '/artist-query', aliases: ['/blank-8-1-1', '/about-8-1-1', '/forms/artist-query'] },
  { title: 'Book A Call', route: '/book-a-call', aliases: ['/blank-8', '/about-8', '/forms/book-a-call'] },
  { title: 'Masterclass Review 01', route: '/masterclass-review01', aliases: ['/forms/masterclass-review01'] },
  { title: 'Classical Review', route: '/classicalreview', aliases: ['/forms/classicalreview'] },
  { title: 'Masterclass Review 02', route: '/masterclass-review02', aliases: ['/forms/masterclass-review02'] },
  { title: 'Affiliate Program', route: '/affiliate', aliases: ['/academy/affiliate'] },
];

const primaryPages = [
  { title: 'Home', route: '/', file: 'home.html' },
  { title: 'About', route: '/about', file: 'about.html' },
  { title: 'Work', route: '/work', file: 'work.html' },
  { title: 'TSC Artists', route: '/artists', file: 'artists.html' },
  { title: 'Artist Path', route: '/artist-path', file: 'artist-path.html' },
  { title: 'Films', route: '/films', file: 'films.html' },
  { title: 'Resources', route: '/resources', file: 'resources.html' },
  { title: 'TSC Academy', route: '/academy', file: 'academy.html' },
];

function slugFromRoute(route) {
  return route === '/' ? 'home' : route.replace(/^\//, '');
}

function pageFileForRoute(route) {
  return `${slugFromRoute(route)}.html`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceJsonStringValue(json, key, value) {
  return json.replace(new RegExp(`("${escapeRegExp(key)}"\\s*:\\s*)"[^"]*"`, 'g'), `$1${JSON.stringify(value)}`);
}

function routeForHref(href) {
  for (const page of subpages) {
    if (page.aliases.includes(href)) return page.route;
  }
  return href;
}

function aliasReplacements() {
  const replacements = new Map();
  for (const page of subpages) {
    for (const alias of page.aliases) replacements.set(alias, page.route);
  }
  return [...replacements.entries()].sort((a, b) => b[0].length - a[0].length);
}

function canonicalizeAliasLinks(text) {
  for (const [from, to] of aliasReplacements()) {
    text = text.replace(new RegExp(`href="${escapeRegExp(from)}"`, 'g'), `href="${to}"`);
    text = text.replace(new RegExp(`href='${escapeRegExp(from)}'`, 'g'), `href='${to}'`);
    text = text.split(JSON.stringify(from)).join(JSON.stringify(to));
    text = text.split(from.replace(/\//g, '\\/')).join(to.replace(/\//g, '\\/'));
    text = text.split(encodeURIComponent(from)).join(encodeURIComponent(to));
    text = text.split(`\\u002F${from.slice(1)}`).join(`\\u002F${to.slice(1)}`);
  }
  return text;
}

function rewriteLinks(html) {
  html = canonicalizeAliasLinks(html);
  html = html.replace(
    /(<a\b(?=[^>]*href=["']\/artists["'])[^>]*\bhref=)(["'])\/artists\2([^>]*>[\s\S]*?Book an Artist[\s\S]*?<\/a>)/gi,
    '$1$2/book-an-artist$2$3'
  );
  html = html.replace(
    /(<a\b(?=[^>]*href=["']\/book-an-artist["'])[^>]*\bhref=)(["'])\/book-an-artist\2([^>]*>[\s\S]*?(?:Book an Artist|Partner With Us)[\s\S]*?<\/a>)/gi,
    '$1$2/book-an-artist$2$3'
  );
  return html;
}

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walkFiles(fullPath) : [fullPath];
  });
}

function canonicalizeRuntimePayloadLinks() {
  const payloadDir = path.join(publicDir, 'assets', 'mirror', 'siteassets.parastorage.com', 'pages', 'pages', 'thunderbolt');
  let updated = 0;
  for (const filePath of walkFiles(payloadDir).filter(file => file.endsWith('.json'))) {
    const json = fs.readFileSync(filePath, 'utf8');
    const next = canonicalizeAliasLinks(json);
    if (next === json) continue;
    fs.writeFileSync(filePath, next, 'utf8');
    updated++;
  }
  return updated;
}

function setRuntimeRoute(html, page) {
  const absoluteUrl = `https://wix-site-clone-psi.vercel.app${page.route}`;
  html = html.replace(/"requestUrl":"https:\\\/\\\/wix-site-clone-psi\.vercel\.app\\\/[^"]*"/g, `"requestUrl":${JSON.stringify(absoluteUrl).replace(/\//g, '\\/')}`);
  html = html.replace(/"pageTitle":"[^"]*"/g, `"pageTitle":${JSON.stringify(page.title)}`);
  html = html.replace(/"pageId":"[^"]*"/g, match => match);
  html = replaceJsonStringValue(html, 'currentPagePath', page.route);
  return html;
}

function buildShell(page, baseHtml) {
  let html = setRuntimeRoute(baseHtml, page);
  html = rewriteLinks(html);
  html = html.replace(
    new RegExp(`/css/pages/${basePage}\\.css`, 'g'),
    `/css/pages/${basePage}.css`
  );
  html = html.replace(
    new RegExp(`/js/pages/${basePage}\\.animations\\.js`, 'g'),
    `/js/pages/${basePage}.animations.js`
  );
  return html;
}

function linkNormalizerScript() {
  return '';
}

function refreshPageScripts() {
  const normalizer = linkNormalizerScript();
  const marker = /[\r\n]*\/\/ tsc-link-normalizer-start[\s\S]*?\/\/ tsc-link-normalizer-end[\r\n]*/g;
  for (const file of fs.readdirSync(path.join(publicDir, 'js', 'pages')).filter(file => file.endsWith('.js'))) {
    const filePath = path.join(publicDir, 'js', 'pages', file);
    const script = fs.readFileSync(filePath, 'utf8').replace(marker, '').trimEnd();
    fs.writeFileSync(filePath, `${script}${normalizer}`, 'utf8');
  }
}

function main() {
  const baseHtml = fs.readFileSync(path.join(pagesDir, `${basePage}.html`), 'utf8');
  let createdShells = 0;
  let keptPages = 0;
  for (const page of subpages) {
    const pagePath = path.join(pagesDir, pageFileForRoute(page.route));
    if (fs.existsSync(pagePath)) {
      keptPages++;
      continue;
    }
    fs.writeFileSync(pagePath, buildShell(page, baseHtml), 'utf8');
    createdShells++;
  }

  const allKnownRoutes = [...primaryPages.map(page => page.route), ...subpages.map(page => page.route)];
  const aliases = subpages.flatMap(page => page.aliases.map(alias => ({ alias, route: page.route })));

  for (const file of fs.readdirSync(pagesDir).filter(file => file.endsWith('.html'))) {
    const pagePath = path.join(pagesDir, file);
    fs.writeFileSync(pagePath, rewriteLinks(fs.readFileSync(pagePath, 'utf8')), 'utf8');
  }
  const updatedPayloads = canonicalizeRuntimePayloadLinks();
  refreshPageScripts();

  const routing = {
    primaryPages,
    subpages: subpages.map(page => ({ ...page, file: pageFileForRoute(page.route) })),
    aliases,
    allRoutes: allKnownRoutes,
  };
  fs.writeFileSync(path.join(publicDir, 'pages', 'routes.manifest.json'), `${JSON.stringify(routing, null, 2)}\n`, 'utf8');
  const injectResult = injectAllPages();
  console.log(`Generated ${createdShells} subpage shells, kept ${keptPages} existing pages, and mapped ${aliases.length} alias routes.`);
  console.log(`Canonicalized ${updatedPayloads} Thunderbolt payload link files.`);
  console.log(`Responsive assets: scanned ${injectResult.scanned}, updated ${injectResult.updated}.`);
}

main();

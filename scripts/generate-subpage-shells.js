const fs = require('fs');
const path = require('path');
const { injectAllPages } = require('./inject-responsive-assets');

const publicDir = path.join(__dirname, '..', 'public');
const pagesDir = path.join(publicDir, 'pages');

const basePage = 'home';
// Cryptic Wix aliases stay in manifest for redirects; do NOT write public/<blank-*> stubs.
const CRYPTIC_ALIAS_RE = /^\/(blank-|about-[89]|work[023]|query$)/;

const subpages = [
  { title: 'MBA', route: '/mba', aliases: ['/blank-7', '/work/mba'] },
  { title: 'Havells mYOUsic', route: '/havells-myousic', aliases: ['/work2', '/work/havells-myousic'] },
  { title: 'Insta Music League', route: '/insta-music-league', aliases: ['/work3', '/work/insta-music-league'] },
  { title: 'Young Gunns', route: '/young-gunns', aliases: ['/work0', '/work/young-gunns'] },
  { title: 'Harshad Duhita', route: '/harshad-duhita', aliases: ['/blank-10', '/artists/harshad-duhita'] },
  { title: 'Roots of Hindustani Classical', route: '/roots-of-hindustani-classical', aliases: ['/blank-9-1', '/about-9-1', '/academy/roots-of-hindustani-classical'] },
  { title: 'The HeART of Composition', route: '/the-heart-of-composition', aliases: ['/blank-9', '/about-9', '/academy/the-heart-of-composition'] },
  { title: 'Blog 1', route: '/blog-1', aliases: ['/blank-13', '/resources/blog-1'] },
  { title: 'YUGM', route: '/yugm', aliases: ['/blank-10-1', '/work0-1', '/artists/yugm'] },
  { title: 'Mahaprbhu', route: '/mahaprbhu', aliases: ['/blank-12-1-1', '/work2-1-1', '/films/mahaprbhu'] },
  { title: 'Mahavatar Narsimha', route: '/mahavatar-narsimha', aliases: ['/blank-12', '/films/mahavatar-narsimha'] },
  { title: 'Hanuman ansh', route: '/hanuman-ansh', aliases: ['/blank-12-1', '/work2-1', '/films/hanuman-ansh'] },
  { title: 'Blog 3', route: '/blog-3', aliases: ['/blank-13-1-1', '/work3-1-1', '/resources/blog-3'] },
  { title: 'Blog 2', route: '/blog-2', aliases: ['/blank-13-1', '/work3-1', '/resources/blog-2'] },
  { title: 'Indian Culture Mainstream Forms', route: '/from-bhajan-to-clubbing', aliases: ['/resources/from-bhajan-to-clubbing'] },
  { title: 'You Released a Song. Now What?', route: '/you-released-a-song-now-what', aliases: ['/resources/you-released-a-song-now-what'] },
  { title: 'Collab Q', route: '/collab-query', aliases: ['/blank-6', '/forms/collab-query'] },
  { title: 'Kalki', route: '/kalki', aliases: ['/blank-12-1-1-1', '/work2-1-1-1', '/films/kalki'] },
  { title: 'Book An Artist', route: '/book-an-artist', aliases: ['/blank-8-1', '/about-8-1', '/query', '/forms/book-an-artist'] },
  { title: 'Artist Path Query', route: '/artist-query', aliases: ['/blank-8-1-1', '/about-8-1-1', '/forms/artist-query'] },
  { title: 'Book A Call', route: '/book-a-call', aliases: ['/blank-8', '/about-8', '/forms/book-a-call'] },
  { title: 'Masterclass Review 01', route: '/masterclass-review01', aliases: ['/forms/masterclass-review01'] },
  { title: 'Classical Review', route: '/classicalreview', aliases: ['/forms/classicalreview'] },
  { title: 'Masterclass Review 02', route: '/masterclass-review02', aliases: ['/forms/masterclass-review02'] },
];

function shouldWriteAliasShim(alias) {
  return !CRYPTIC_ALIAS_RE.test(alias);
}

const primaryPages = [
  { title: 'Home', route: '/', file: 'home.html' },
  { title: 'About', route: '/about', file: 'about.html' },
  { title: 'Work', route: '/work', file: 'work.html' },
  { title: 'TSC Artists', route: '/artists', file: 'artists.html' },
  { title: 'Artist Path', route: '/artist-path', file: 'artist-path.html' },
  { title: 'Learn With TSC', route: '/learn-with-tsc', file: 'learn-with-tsc.html' },
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

function rewriteLinks(html) {
  const replacements = new Map();
  for (const page of subpages) {
    for (const alias of page.aliases) replacements.set(alias, page.route);
  }
  for (const [from, to] of replacements) {
    html = html.replace(new RegExp(`href="${escapeRegExp(from)}"`, 'g'), `href="${to}"`);
    html = html.replace(new RegExp(`href='${escapeRegExp(from)}'`, 'g'), `href='${to}'`);
    html = html.replace(new RegExp(escapeRegExp(`\\u002F${from.slice(1)}`), 'g'), `\\u002F${to.slice(1)}`);
  }
  html = html.replace(
    /(<a\b(?=[^>]*href=["']\/artists["'])[^>]*\bhref=)(["'])\/artists\2([^>]*>[\s\S]*?Book an Artist[\s\S]*?<\/a>)/gi,
    '$1$2/query$2$3'
  );
  html = html.replace(
    /(<a\b(?=[^>]*href=["']\/book-an-artist["'])[^>]*\bhref=)(["'])\/book-an-artist\2([^>]*>[\s\S]*?(?:Book an Artist|Partner With Us)[\s\S]*?<\/a>)/gi,
    '$1$2/query$2$3'
  );
  return html;
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

function shimHtml(route) {
  const destination = `/pages/${pageFileForRoute(route)}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0; url=${destination}">
  <script>location.replace(${JSON.stringify(destination)} + location.search + location.hash);</script>
</head>
<body><a href="${destination}">Open ${route}</a></body>
</html>
`;
}

function linkNormalizerScript() {
  const aliasMap = {};
  for (const page of subpages) {
    for (const alias of page.aliases) {
      if (alias !== '/query') aliasMap[alias] = page.route;
    }
  }
  return `

// tsc-link-normalizer-start
(function() {
  var routeMap = ${JSON.stringify(aliasMap, null, 2)};
  var academyPaths = {
    '/academy': true,
    '/learn-with-tsc': true,
    '/the-heart-of-composition': true,
    '/roots-of-hindustani-classical': true,
    '/book-a-call': true,
    '/masterclass-review01': true,
    '/masterclass-review02': true,
    '/classicalreview': true
  };
  function normalizeAnchor(anchor) {
    try {
      var url = new URL(anchor.getAttribute('href'), location.origin);
      var target = routeMap[url.pathname];
      if (!target && url.pathname === '/artists' && /book\\s+an\\s+artist/i.test(anchor.textContent || '')) {
        target = '/query';
      }
      if (!target) return;
      var nextHref = target + url.search + url.hash;
      if (anchor.getAttribute('href') !== nextHref) anchor.setAttribute('href', nextHref);
    } catch (e) {}
  }
  function normalizeAcademyLogoLinks() {
    if (!academyPaths[location.pathname]) return;
    document.querySelectorAll('header a[href], [class*="wixui-header"] a[href]').forEach(function(anchor) {
      try {
        var url = new URL(anchor.getAttribute('href'), location.origin);
        var isHomeLink = url.pathname === '/' || url.pathname === '/blank-3';
        var isLogo = !!anchor.closest('.wixui-vector-image, [class*="wixui-vector-image"]');
        if (isHomeLink && isLogo && anchor.getAttribute('href') !== '/academy') {
          anchor.setAttribute('href', '/academy');
          anchor.setAttribute('target', '_self');
        }
      } catch (e) {}
    });
  }
  function normalizeLinks() {
    document.querySelectorAll('a[href]').forEach(normalizeAnchor);
    document.querySelectorAll('a[href="/book-an-artist"]').forEach(function(anchor) {
      if (/book\\s+an\\s+artist|partner\\s+with\\s+us/i.test(anchor.textContent || '') || location.pathname === '/artists') {
        if (anchor.getAttribute('href') !== '/query') anchor.setAttribute('href', '/query');
      }
    });
    normalizeAcademyLogoLinks();
  }
  normalizeLinks();
  var componentsScript = document.querySelector('script[src="/js/tsc-components.js"]');
  if (!componentsScript) {
    componentsScript = document.createElement('script');
    componentsScript.src = '/js/tsc-components.js';
    componentsScript.defer = true;
    document.head.appendChild(componentsScript);
  }
  function loadAfterComponents(src) {
    if (document.querySelector('script[src="' + src + '"]')) return;
    var script = document.createElement('script');
    script.src = src;
    script.defer = true;
    if (window.TSCComponents) {
      document.head.appendChild(script);
    } else {
      componentsScript.addEventListener('load', function() {
        document.head.appendChild(script);
      });
    }
  }
  if (!document.querySelector('script[src="/js/forms.js"]')) {
    loadAfterComponents('/js/forms.js');
  }
  if (!document.querySelector('script[src="/js/tsc-animations.js"]')) {
    loadAfterComponents('/js/tsc-animations.js');
  }
  if (!document.querySelector('script[src="/js/content-replacements.js"]')) {
    loadAfterComponents('/js/content-replacements.js');
  }
  window.addEventListener('load', normalizeLinks);
  [250, 1000, 2500, 5000].forEach(function(delay) {
    window.setTimeout(normalizeLinks, delay);
  });
})();
// tsc-link-normalizer-end
`;
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
  for (const page of subpages) {
    const shimPath = path.join(publicDir, ...page.route.slice(1).split('/'), 'index.html');
    fs.mkdirSync(path.dirname(shimPath), { recursive: true });
    fs.writeFileSync(shimPath, shimHtml(page.route), 'utf8');
  }
  for (const { alias, route } of aliases) {
    if (!shouldWriteAliasShim(alias)) continue;
    const shimPath = path.join(publicDir, ...alias.slice(1).split('/'), 'index.html');
    fs.mkdirSync(path.dirname(shimPath), { recursive: true });
    fs.writeFileSync(shimPath, shimHtml(route), 'utf8');
  }

  for (const file of fs.readdirSync(pagesDir).filter(file => file.endsWith('.html'))) {
    const pagePath = path.join(pagesDir, file);
    fs.writeFileSync(pagePath, rewriteLinks(fs.readFileSync(pagePath, 'utf8')), 'utf8');
  }
  refreshPageScripts();

  const routing = {
    primaryPages,
    subpages: subpages.map(page => ({ ...page, file: pageFileForRoute(page.route) })),
    aliases,
    allRoutes: allKnownRoutes,
  };
  fs.writeFileSync(path.join(publicDir, 'pages', 'routes.manifest.json'), `${JSON.stringify(routing, null, 2)}\n`, 'utf8');
  const injectResult = injectAllPages();
  console.log(`Generated ${createdShells} subpage shells, kept ${keptPages} existing pages, and refreshed ${aliases.length} alias shims.`);
  console.log(`Responsive assets: scanned ${injectResult.scanned}, updated ${injectResult.updated}.`);
}

main();

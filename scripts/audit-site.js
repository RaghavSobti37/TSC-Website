const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = path.join(__dirname, '..');
const OUTPUT_ROOT = path.join(ROOT, 'artifacts', 'runtime-audit');
const PRODUCTION_ORIGIN = 'https://wix-site-clone-psi.vercel.app';
const SOURCE_ORIGIN = 'https://meghanabhawalkarwo.wixstudio.com/my-site';

const routes = [
  { name: 'home', path: '/', sourcePath: '' },
  { name: 'about', path: '/about', sourcePath: '/blank' },
  { name: 'work', path: '/work', sourcePath: '/blank-1' },
  { name: 'artists', path: '/artists', sourcePath: '/blank-2' },
  { name: 'artist-path', path: '/artist-path', sourcePath: '/blank-4' },
  { name: 'learn-with-tsc', path: '/learn-with-tsc', sourcePath: '/blank-3-1' },
  { name: 'films', path: '/films', sourcePath: '/blank-11' },
  { name: 'resources', path: '/resources', sourcePath: '/blank-5' },
  { name: 'academy', path: '/academy', sourcePath: '/blank-3' },
];

const viewports = {
  desktop: { width: 1440, height: 1000, deviceScaleFactor: 1 },
  tablet: { width: 768, height: 1024, deviceScaleFactor: 1 },
  mobile: { width: 390, height: 844, deviceScaleFactor: 1 },
};

function parseArgs() {
  const args = process.argv.slice(2);
  const original = args.includes('--original');
  const local = args.includes('--local');
  const viewportArg = args.find(value => value.startsWith('--viewports='));
  const routesArg = args.find(value => value.startsWith('--routes='));
  const requestedViewports = viewportArg
    ? viewportArg.split('=')[1].split(',').filter(name => viewports[name])
    : Object.keys(viewports);
  const baseArg = args.find(value => /^https?:\/\//.test(value));
  return {
    label: original ? 'original' : local ? 'local' : 'production',
    original,
    baseUrl: baseArg || (local ? 'http://127.0.0.1:3100' : original ? SOURCE_ORIGIN : PRODUCTION_ORIGIN),
    requestedViewports,
    requestedRoutes: routesArg ? routesArg.split('=')[1].split(',') : routes.map(route => route.name),
  };
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

async function snapshot(page) {
  return page.evaluate(() => {
    const mediaUrl = element => element.currentSrc || element.src || element.getAttribute('src') || '';
    const images = [...document.images].map((image, index) => {
      const style = getComputedStyle(image);
      const rect = image.getBoundingClientRect();
      const hiddenAncestor = image.closest('[hidden], [aria-hidden="true"]');
      return {
        index,
        src: mediaUrl(image),
        srcset: image.srcset || '',
        complete: image.complete,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        visible: rect.width > 1 && rect.height > 1 && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && !hiddenAncestor,
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        hiddenAncestor: hiddenAncestor ? `${hiddenAncestor.tagName.toLowerCase()}#${hiddenAncestor.id || ''}` : '',
        alt: image.alt || '',
      };
    });
    const videos = [...document.querySelectorAll('video')].map((video, index) => ({
      index,
      src: mediaUrl(video) || mediaUrl(video.querySelector('source') || {}),
      poster: video.poster || '',
      readyState: video.readyState,
      networkState: video.networkState,
      paused: video.paused,
      ended: video.ended,
      currentTime: video.currentTime,
      duration: Number.isFinite(video.duration) ? video.duration : null,
      autoplay: video.autoplay,
      muted: video.muted,
      loop: video.loop,
      visible: Boolean(video.offsetWidth || video.offsetHeight || video.getClientRects().length),
      error: video.error ? { code: video.error.code, message: video.error.message } : null,
    }));
    const motionSelector = '[data-motion-enter], [data-has-animation="true"], [data-animation-name], [data-motion-part]';
    const motion = [...document.querySelectorAll(motionSelector)].map((element, index) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return {
        index,
        tag: element.tagName.toLowerCase(),
        id: element.id || '',
        motionEnter: element.getAttribute('data-motion-enter'),
        animationNameAttribute: element.getAttribute('data-animation-name'),
        animationState: element.getAttribute('data-animation-state'),
        opacity: style.opacity,
        transform: style.transform,
        animationName: style.animationName,
        animationDuration: style.animationDuration,
        transition: style.transition,
        inViewport: rect.bottom > 0 && rect.top < innerHeight,
      };
    });
    const canvases = [...document.querySelectorAll('canvas')].map((canvas, index) => ({
      index,
      width: canvas.width,
      height: canvas.height,
      visible: Boolean(canvas.offsetWidth || canvas.offsetHeight || canvas.getClientRects().length),
    }));
    return {
      url: location.href,
      title: document.title,
      bodyHeight: document.documentElement.scrollHeight,
      performanceMarks: performance.getEntriesByType('mark').map(entry => entry.name),
      runtimeResources: performance.getEntriesByType('resource')
        .map(entry => entry.name)
        .filter(url => /thunderbolt|pageJson|pages\/pages/i.test(url)),
      images,
      videos,
      motion,
      canvases,
    };
  });
}

async function exercisePage(page) {
  await page.evaluate(async () => {
    const images = [...document.images];
    images.forEach(image => { image.loading = 'eager'; });
    const videos = [...document.querySelectorAll('video')];
    await Promise.all([
      ...images.map(image => image.complete ? Promise.resolve() : new Promise(resolve => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
        setTimeout(resolve, 5000);
      })),
      ...videos.map(async video => {
        try {
          await video.play();
        } catch {
          // The report records whether playback actually advanced.
        }
      }),
    ]);
  });

  const bodyHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const viewportHeight = await page.evaluate(() => innerHeight);
  const step = Math.max(300, Math.floor(viewportHeight * 0.65));
  for (let top = 0; top < bodyHeight; top += step) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), top);
    await new Promise(resolve => setTimeout(resolve, 120));
  }
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await new Promise(resolve => setTimeout(resolve, 1200));
}

function summarize(before, after, diagnostics) {
  const brokenImages = after.images.filter(image => image.visible && (!image.complete || image.naturalWidth === 0));
  const videoResults = after.videos.map(video => {
    const initial = before.videos.find(candidate => candidate.index === video.index);
    return {
      ...video,
      advanced: Boolean(initial && video.currentTime > initial.currentTime + 0.15),
    };
  });
  const brokenVideos = videoResults.filter(video => video.visible && (video.error || video.readyState < 2 || !video.src));
  const stalledAutoplayVideos = videoResults.filter(video => video.visible && video.autoplay && !video.advanced && !video.ended);
  const motionResults = after.motion.map(item => {
    const initial = before.motion.find(candidate => candidate.index === item.index);
    return {
      ...item,
      changed: Boolean(initial && (
        initial.motionEnter !== item.motionEnter ||
        initial.animationState !== item.animationState ||
        initial.opacity !== item.opacity ||
        initial.transform !== item.transform
      )),
      completed: item.motionEnter === 'done' || item.animationState === 'done' || item.animationState === 'finished',
    };
  });
  const unresolvedMotion = motionResults.filter(item => item.motionEnter && item.motionEnter !== 'done');
  const runtimeFailures = unique([
    ...diagnostics.pageErrors,
    ...diagnostics.requestFailures,
    ...diagnostics.httpErrors,
  ]);

  return {
    url: after.url,
    title: after.title,
    bodyHeight: after.bodyHeight,
    performanceMarks: after.performanceMarks,
    runtimeResources: after.runtimeResources,
    counts: {
      images: after.images.length,
      visibleImages: after.images.filter(image => image.visible).length,
      videos: after.videos.length,
      visibleVideos: after.videos.filter(video => video.visible).length,
      motionCandidates: after.motion.length,
      changedMotion: motionResults.filter(item => item.changed).length,
      completedMotion: motionResults.filter(item => item.completed).length,
      canvases: after.canvases.length,
    },
    brokenImages,
    brokenVideos,
    stalledAutoplayVideos,
    unresolvedMotion,
    videoResults,
    motionResults,
    diagnostics: {
      ...diagnostics,
      consoleErrors: unique(diagnostics.consoleErrors),
      pageErrors: unique(diagnostics.pageErrors),
      requestFailures: unique(diagnostics.requestFailures),
      httpErrors: unique(diagnostics.httpErrors),
    },
    passed: brokenImages.length === 0 &&
      brokenVideos.length === 0 &&
      stalledAutoplayVideos.length === 0 &&
      unresolvedMotion.length === 0 &&
      runtimeFailures.length === 0,
  };
}

async function auditRoute(browser, config, route, viewportName) {
  const page = await browser.newPage();
  await page.setViewport(viewports[viewportName]);
  await page.setCacheEnabled(false);
  const diagnostics = { consoleErrors: [], pageErrors: [], requestFailures: [], httpErrors: [] };
  page.on('console', message => {
    if (message.type() === 'error') diagnostics.consoleErrors.push(message.text());
  });
  page.on('pageerror', error => diagnostics.pageErrors.push(error.stack || error.message));
  page.on('requestfailed', request => {
    const navigationAbortedMedia = ['image', 'media'].includes(request.resourceType()) && request.failure()?.errorText === 'net::ERR_ABORTED';
    if (navigationAbortedMedia) return;
    diagnostics.requestFailures.push(`${request.failure()?.errorText || 'FAILED'} ${request.url()}`);
  });
  page.on('response', response => {
    if (response.status() >= 400) diagnostics.httpErrors.push(`${response.status()} ${response.url()}`);
  });

  const routePath = config.original ? route.sourcePath : route.path;
  const url = `${config.baseUrl.replace(/\/$/, '')}${routePath || '/'}`;
  let loadError = null;
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
  } catch (error) {
    loadError = error.message;
    diagnostics.pageErrors.push(`Navigation: ${error.message}`);
  }
  await new Promise(resolve => setTimeout(resolve, 2500));
  const before = await snapshot(page);
  await exercisePage(page);
  const after = await snapshot(page);
  const result = summarize(before, after, diagnostics);
  result.route = route.name;
  result.viewport = viewportName;
  result.loadError = loadError;

  const outputDir = path.join(OUTPUT_ROOT, config.label, viewportName);
  fs.mkdirSync(outputDir, { recursive: true });
  await page.screenshot({ path: path.join(outputDir, `${route.name}.png`), fullPage: true });
  fs.writeFileSync(path.join(outputDir, `${route.name}.json`), JSON.stringify(result, null, 2));
  await page.close();
  return result;
}

async function main() {
  const config = parseArgs();
  fs.mkdirSync(OUTPUT_ROOT, { recursive: true });
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--autoplay-policy=no-user-gesture-required'],
  });
  const results = [];
  try {
    for (const viewportName of config.requestedViewports) {
      for (const route of routes.filter(candidate => config.requestedRoutes.includes(candidate.name))) {
        process.stdout.write(`Auditing ${config.label} ${viewportName} ${route.name}... `);
        const result = await auditRoute(browser, config, route, viewportName);
        results.push(result);
        console.log(result.passed ? 'PASS' : 'FAIL');
      }
    }
  } finally {
    await browser.close();
  }
  const report = {
    target: config.baseUrl,
    label: config.label,
    generatedAt: new Date().toISOString(),
    passed: results.every(result => result.passed),
    results,
  };
  const reportPath = path.join(OUTPUT_ROOT, `${config.label}-report.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Report: ${reportPath}`);
  console.log(`Result: ${report.passed ? 'PASS' : 'FAIL'}`);
  if (!report.passed) process.exitCode = 1;
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});

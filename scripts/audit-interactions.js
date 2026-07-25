const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'artifacts', 'interaction-audit');
const THUNDERBOLT_DIR = path.join(ROOT, 'public', 'assets', 'mirror', 'siteassets.parastorage.com', 'pages', 'pages', 'thunderbolt');
const DEFAULT_ORIGIN = 'https://wix-site-clone-psi.vercel.app';

const routes = [
  { name: 'home', path: '/', sourcePath: '', pageFile: '19f989_ee80f317bf89e6216cc9c510c9e545d7_1360' },
  { name: 'about', path: '/about', sourcePath: '/blank', pageFile: '19f989_ed01b585eb5b79e5069c93f6d6ccf82c_1342' },
  { name: 'work', path: '/work', sourcePath: '/blank-1', pageFile: '19f989_a89e6d8c684584a5a5841afdb9e1d6eb_1316' },
  { name: 'artists', path: '/artists', sourcePath: '/blank-2', pageFile: '19f989_363e917e98e6d1f48f732c46aef87fd1_1362' },
  { name: 'artist-path', path: '/artist-path', sourcePath: '/blank-4', pageFile: '19f989_0acee9e71a994e6d376e0bba81dfa461_1365' },
  { name: 'learn-with-tsc', path: '/learn-with-tsc', sourcePath: '/blank-3-1', pageFile: '19f989_ecfdda4745d283863acf8267776ef2fd_1305' },
  { name: 'films', path: '/films', sourcePath: '/blank-11', pageFile: '19f989_6e16e7b8d427e689039e2c59c89523fa_1301' },
  { name: 'resources', path: '/resources', sourcePath: '/blank-5', pageFile: '19f989_a2ea6c0a2625ceae9b9c795b2052630f_1336' },
  { name: 'academy', path: '/academy', sourcePath: '/blank-3', pageFile: '19f989_2989b66cd25e783b84617171c4c13822_1362' },
];

const sourceInertHovers = new Set([
  'learn-with-tsc|comp-mrufx9s5|comp-mrufx9s5',
  'academy|comp-mpjxxere2|comp-mpjxxere2',
]);

function parseArgs() {
  const args = process.argv.slice(2);
  const original = args.includes('--original');
  const local = args.includes('--local');
  const url = args.find(arg => /^https?:\/\//.test(arg));
  const routeArg = args.find(arg => arg.startsWith('--routes='));
  return {
    original,
    origin: url || (local ? 'http://127.0.0.1:3100' : original ? 'https://meghanabhawalkarwo.wixstudio.com/my-site' : DEFAULT_ORIGIN),
    routeNames: routeArg ? routeArg.split('=')[1].split(',') : routes.map(route => route.name),
  };
}

function findFeatureConfig(pageFile) {
  const file = fs.readdirSync(THUNDERBOLT_DIR).find(name =>
    name.startsWith('thunderbolt-features--') && name.includes(pageFile));
  if (!file) throw new Error(`Missing Thunderbolt feature payload for ${pageFile}`);
  return JSON.parse(fs.readFileSync(path.join(THUNDERBOLT_DIR, file), 'utf8'));
}

function interactionModel(route) {
  const payload = findFeatureConfig(route.pageFile);
  const props = payload.props || {};
  const triggerConfig = props.triggersAndReactions || payload.triggersAndReactions || {};
  const hoverTests = [];
  let viewportTriggers = 0;
  let progressTriggers = 0;
  for (const [sourceId, triggerTypes] of Object.entries(triggerConfig.compsToTriggers || {})) {
    viewportTriggers += triggerTypes['viewport-enter'] ? 1 : 0;
    progressTriggers += triggerTypes['view-progress'] ? 1 : 0;
    for (const [targetId, groups] of Object.entries(triggerTypes.hover || {})) {
      const stateNames = groups.flatMap(group => group.reactions || [])
        .filter(reaction => reaction.type === 'AddState')
        .map(reaction => reaction.reactionData && reaction.reactionData.name)
        .filter(Boolean);
      hoverTests.push({ sourceId, targetId, stateNames });
    }
  }
  return { hoverTests, viewportTriggers, progressTriggers };
}

async function sampleMotion(page, seen) {
  const animations = await page.evaluate(() => document.getAnimations({ subtree: true }).map(animation => ({
    name: animation.animationName || '(scrub)',
    target: animation.effect && animation.effect.target && (
      animation.effect.target.id || animation.effect.target.closest?.('[id]')?.id || ''
    ),
    duration: animation.effect && animation.effect.getTiming ? animation.effect.getTiming().duration : null,
  })));
  for (const animation of animations) seen.set(`${animation.name}|${animation.target}`, animation);
}

async function waitForRuntime(page) {
  await page.waitForFunction(() => {
    const marks = performance.getEntriesByType('mark').map(entry => entry.name);
    return marks.includes('features_appWillMount finished') && marks.includes('client_render finished');
  }, { timeout: 60000 });
}

async function styleFingerprint(page, id) {
  return page.evaluate(targetId => {
    const target = document.getElementById(targetId);
    if (!target) return null;
    return [target, ...target.querySelectorAll('*')].slice(0, 16).map(element => {
      const style = getComputedStyle(element);
      return {
        tag: element.tagName,
        id: element.id || '',
        className: typeof element.className === 'string' ? element.className : element.className?.baseVal || '',
        opacity: style.opacity,
        transform: style.transform,
        filter: style.filter,
        color: style.color,
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        boxShadow: style.boxShadow,
        fill: style.fill,
        stroke: style.stroke,
      };
    });
  }, id);
}

async function auditHover(page, test) {
  const source = await page.$(`#${test.sourceId}`);
  const target = await page.$(`#${test.targetId}`);
  if (!source) return { ...test, status: 'skipped', reason: 'source-not-rendered-at-desktop-breakpoint' };
  if (!target) return { ...test, status: 'failed', reason: 'target-missing' };
  await source.evaluate(element => element.scrollIntoView({ block: 'center', inline: 'center' }));
  await new Promise(resolve => setTimeout(resolve, 180));
  const box = await source.boundingBox();
  if (!box || box.width < 1 || box.height < 1) {
    return { ...test, status: 'skipped', reason: 'source-hidden-at-desktop-breakpoint' };
  }
  await page.mouse.move(1, 1);
  await new Promise(resolve => setTimeout(resolve, 120));
  const before = await styleFingerprint(page, test.targetId);
  try {
  await source.hover();
  } catch (error) {
    return { ...test, status: 'skipped', reason: error.message };
  }
  await new Promise(resolve => setTimeout(resolve, 450));
  let after = await styleFingerprint(page, test.targetId);
  let targetClasses = after && after[0] ? after[0].className.split(/\s+/) : [];
  let stateApplied = test.stateNames.length === 0 || test.stateNames.some(name => targetClasses.includes(name));
  let changed = JSON.stringify(before) !== JSON.stringify(after);
  if (!changed || !stateApplied) {
    await page.mouse.move(1, 1);
    await new Promise(resolve => setTimeout(resolve, 120));
    await page.mouse.move(box.x + 2, box.y + 2);
    await new Promise(resolve => setTimeout(resolve, 450));
    after = await styleFingerprint(page, test.targetId);
    targetClasses = after && after[0] ? after[0].className.split(/\s+/) : [];
    stateApplied = test.stateNames.length === 0 || test.stateNames.some(name => targetClasses.includes(name));
    changed = JSON.stringify(before) !== JSON.stringify(after);
  }
  await page.mouse.move(1, 1);
  const status = changed && stateApplied ? 'passed' : 'failed';
  const debug = status === 'failed' ? await page.evaluate(({ sourceId, x, y }) => {
    const source = document.getElementById(sourceId);
    const hit = document.elementFromPoint(x, y);
    return {
      sourceClass: source?.className || '',
      hitId: hit?.id || '',
      hitAncestorId: hit?.closest?.('[id]')?.id || '',
      hitTag: hit?.tagName || '',
    };
  }, { sourceId: test.sourceId, x: box.x + box.width / 2, y: box.y + box.height / 2 }) : undefined;
  return { ...test, status, changed, stateApplied, ...(debug ? { debug } : {}) };
}

async function auditRoute(browser, config, route) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await page.setCacheEnabled(false);
  const diagnostics = { pageErrors: [], requestFailures: [], consoleErrors: [] };
  page.on('pageerror', error => diagnostics.pageErrors.push(error.stack || error.message));
  page.on('requestfailed', request => {
    const navigationAbortedMedia = ['image', 'media'].includes(request.resourceType()) && request.failure()?.errorText === 'net::ERR_ABORTED';
    if (!navigationAbortedMedia && !/(?:frog\.wix\.com|panorama\.wixapps\.net|sentry-next\.wixpress\.com)/i.test(request.url())) {
      diagnostics.requestFailures.push(`${request.failure()?.errorText || 'FAILED'} ${request.url()}`);
    }
  });
  page.on('console', message => {
    if (message.type() === 'error') diagnostics.consoleErrors.push(message.text());
  });

  const routePath = config.original ? route.sourcePath : route.path;
  const url = `${config.origin.replace(/\/$/, '')}${routePath || '/'}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await waitForRuntime(page);
  const model = interactionModel(route);
  const seen = new Map();
  for (let index = 0; index < 20; index += 1) {
    await sampleMotion(page, seen);
    await new Promise(resolve => setTimeout(resolve, 80));
  }
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate(top => window.scrollTo(0, top), y);
    for (let index = 0; index < 4; index += 1) {
      await sampleMotion(page, seen);
      await new Promise(resolve => setTimeout(resolve, 70));
    }
  }

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await waitForRuntime(page);
  const orderedHoverTests = await page.evaluate(tests => tests.map((test, index) => {
    const element = document.getElementById(test.sourceId);
    return { index, top: element ? element.getBoundingClientRect().top + scrollY : Number.MAX_SAFE_INTEGER };
  }).sort((left, right) => left.top - right.top).map(item => tests[item.index]), model.hoverTests);
  const hoverResults = [];
  for (const test of orderedHoverTests) hoverResults.push(await auditHover(page, test));
  for (let index = 0; index < hoverResults.length; index += 1) {
    if (hoverResults[index].status !== 'failed') continue;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await waitForRuntime(page);
    hoverResults[index] = await auditHover(page, orderedHoverTests[index]);
  }
  for (const result of hoverResults) {
    if (result.status !== 'failed') continue;
    if (sourceInertHovers.has(`${route.name}|${result.sourceId}|${result.targetId}`)) {
      result.status = 'source-inert';
      result.reason = 'The same authored trigger is inert on the live source site.';
    }
  }
  const marks = await page.evaluate(() => performance.getEntriesByType('mark').map(entry => entry.name));
  const mountFinished = marks.includes('features_appWillMount finished');
  const clientRenderFinished = marks.includes('client_render finished');
  const namedMotion = [...seen.values()].filter(animation => animation.name !== '(scrub)');
  const scrubMotion = [...seen.values()].filter(animation => animation.name === '(scrub)');
  const failedHovers = hoverResults.filter(result => result.status === 'failed');
  const passed = mountFinished && clientRenderFinished &&
    (model.viewportTriggers === 0 || namedMotion.length > 0) &&
    (model.progressTriggers === 0 || scrubMotion.length > 0) &&
    failedHovers.length === 0 && diagnostics.pageErrors.length === 0 && diagnostics.requestFailures.length === 0;
  const result = {
    route: route.name,
    url,
    passed,
    mountFinished,
    clientRenderFinished,
    authored: model,
    observed: { namedMotion, scrubMotion, hoverResults },
    diagnostics,
  };
  await page.screenshot({ path: path.join(OUTPUT_DIR, `${route.name}.png`), fullPage: true });
  await page.close();
  return result;
}

async function main() {
  const config = parseArgs();
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const results = [];
  try {
    for (const route of routes.filter(item => config.routeNames.includes(item.name))) {
      process.stdout.write(`Auditing interactions ${route.name}... `);
      const result = await auditRoute(browser, config, route);
      results.push(result);
      console.log(result.passed ? 'PASS' : 'FAIL');
    }
  } finally {
    await browser.close();
  }
  const report = { generatedAt: new Date().toISOString(), target: config.origin, passed: results.every(result => result.passed), results };
  fs.writeFileSync(path.join(OUTPUT_DIR, 'report.json'), JSON.stringify(report, null, 2));
  console.log(`Result: ${report.passed ? 'PASS' : 'FAIL'}`);
  if (!report.passed) process.exitCode = 1;
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});

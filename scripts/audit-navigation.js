const puppeteer = require('puppeteer');

const productionUrl = 'https://wix-site-clone-psi.vercel.app';
const baseUrl = process.argv.includes('--local') ? 'http://127.0.0.1:3100' : productionUrl;
const destinations = ['/about', '/work', '/artists', '/films', '/resources', '/academy'];

async function waitForRender(page) {
  await page.waitForFunction(() => {
    const marks = performance.getEntriesByType('mark').map(mark => mark.name);
    const renderedPage = document.querySelector('#SITE_PAGES, .wixui-page, [data-testid="page-bg"]');
    return marks.includes('client_render finished') || Boolean(renderedPage?.textContent?.trim());
  }, { timeout: 60000 });
}

async function visibleLinkFor(page, destination) {
  const links = await page.$$(`a[href="${destination}"]`);
  for (const link of links) {
    const visible = await link.evaluate(node => {
      const rect = node.getBoundingClientRect();
      const style = window.getComputedStyle(node);
      return rect.width > 1 &&
        rect.height > 1 &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        Number(style.opacity || 1) !== 0;
    });
    if (visible) return link;
  }
  return null;
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });

  try {
    for (const destination of destinations) {
      await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await waitForRender(page);
      const link = await visibleLinkFor(page, destination);
      if (!link) throw new Error(`Missing navigation link for ${destination}`);
      await link.click();
      try {
        await page.waitForFunction(pathname => location.pathname === pathname, { timeout: 60000 }, destination);
      } catch (error) {
        const debug = await page.evaluate(() => ({
          path: location.pathname,
          href: document.querySelector('nav a[href]')?.href,
        }));
        throw new Error(`${destination} did not navigate: ${JSON.stringify(debug)} (${error.message})`);
      }
      await waitForRender(page);
      const state = await page.evaluate(() => ({
        path: location.pathname,
        badgeLinks: document.querySelectorAll('a[href*="wix.com/studio"], #WIX_ADS a').length,
        badgeText: document.body.innerText.includes('Built on Wix Studio'),
        hasPage: Boolean(document.querySelector('.wixui-page, [data-testid="page-bg"], #SITE_PAGES')),
      }));
      if (state.path !== destination || state.badgeLinks || state.badgeText || !state.hasPage) {
        throw new Error(`${destination} failed: ${JSON.stringify(state)}`);
      }
      console.log(`Navigation ${destination}... PASS`);
    }
  } finally {
    await browser.close();
  }
  console.log('Result: PASS');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});

import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/rakesh/.gemini/antigravity-ide/brain/cadfab10-bd90-4e32-876f-c041f0ce13f4';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  const routes = [
    { url: 'http://localhost:3000/', name: 'rebuild_home_page.png' },
    { url: 'http://localhost:3000/shop', name: 'rebuild_shop_page.png' },
    { url: 'http://localhost:3000/product/forest-honey', name: 'rebuild_product_detail.png' },
    { url: 'http://localhost:3000/about', name: 'rebuild_about_page.png' },
    { url: 'http://localhost:3000/lab-reports', name: 'rebuild_lab_reports.png' },
    { url: 'http://localhost:3000/reviews', name: 'rebuild_reviews_page.png' },
    { url: 'http://localhost:3000/faq', name: 'rebuild_faq_page.png' },
    { url: 'http://localhost:3000/contact', name: 'rebuild_contact_page.png' },
  ];

  for (const r of routes) {
    console.log(`Navigating to ${r.url}...`);
    await page.goto(r.url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const savePath = path.join(ARTIFACT_DIR, r.name);
    await page.screenshot({ path: savePath, fullPage: false });
    console.log(`Saved screenshot: ${r.name}`);
  }

  await browser.close();
  console.log('All multipage screenshots captured successfully.');
}

capture().catch((e) => {
  console.error(e);
  process.exit(1);
});

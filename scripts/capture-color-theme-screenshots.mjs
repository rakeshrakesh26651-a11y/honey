import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/rakesh/.gemini/antigravity-ide/brain/cadfab10-bd90-4e32-876f-c041f0ce13f4';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Hero & Header
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'theme_hero_header.png'),
    clip: { x: 0, y: 0, width: 1280, height: 850 },
  });

  // 2. Feature Strip & Product Collection
  const lineupEl = await page.$('#lineup');
  if (lineupEl) {
    await lineupEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'theme_product_collection.png'),
    });
  }

  // 3. Testimonials
  const reviewsEl = await page.$('#reviews');
  if (reviewsEl) {
    await reviewsEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'theme_reviews_section.png'),
    });
  }

  // 4. Cart Drawer
  const cartBtn = await page.$('button[aria-label*="cart" i]');
  if (cartBtn) {
    await cartBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'theme_cart_drawer.png'),
    });
  }

  await browser.close();
  console.log('Screenshots captured successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { chromium } from 'playwright';

async function main() {
  console.log('🚀 Running homepage order & FeatureStrip verification...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Smooth scroll through the page to trigger in-view animations
  await page.evaluate(async () => {
    const distance = 350;
    const delay = 80;
    while (document.scrollingElement && document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
      document.scrollingElement.scrollBy(0, distance);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  });
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  // 1. Verify Feature Strip Content
  const f1 = await page.locator('text=SOURCED FROM').count();
  const f2 = await page.locator('text=100% PURE &').count();
  const f3 = await page.locator('text=NATURALLY').count();
  const f4 = await page.locator('text=NO ARTIFICIAL').count();

  console.log('Feature Strip Check:');
  console.log('- 01 SOURCED FROM HIGH ALTITUDES:', f1 > 0);
  console.log('- 02 100% PURE & NATURAL:', f2 > 0);
  console.log('- 03 NATURALLY HARVESTED:', f3 > 0);
  console.log('- 04 NO ARTIFICIAL ADDITIVES:', f4 > 0);

  // 2. Verify Heritage Section
  const heritageHeader = await page.locator('text=FOUR GENERATIONS. ONE TRADITION.').count();
  console.log('Heritage Section present:', heritageHeader > 0);

  // 3. Verify Best Sellers Section
  const bestSellersHeader = await page.locator('text=MEET THE BEST SELLERS').count();
  console.log('Best Sellers Section present:', bestSellersHeader > 0);

  // 4. Verify Best Sellers OLIO Image Interaction
  console.log('Testing OLIO image interaction in Best Sellers...');
  const firstCard = page.locator('#lineup [role="button"]').first();
  const initialAria = await firstCard.getAttribute('aria-label');
  console.log('Initial card aria-label:', initialAria);

  await firstCard.click();
  await page.waitForTimeout(400);
  const toggledAria = await firstCard.getAttribute('aria-label');
  console.log('Toggled card aria-label:', toggledAria);

  await firstCard.click();
  await page.waitForTimeout(400);
  const restoredAria = await firstCard.getAttribute('aria-label');
  console.log('Restored card aria-label:', restoredAria);

  // Capture screenshot of homepage
  await page.screenshot({ path: 'scripts/homepage-restored-feature-strip.png', fullPage: true });
  console.log('Saved scripts/homepage-restored-feature-strip.png');

  await browser.close();
  console.log('✨ Verification complete!');
}

main().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});

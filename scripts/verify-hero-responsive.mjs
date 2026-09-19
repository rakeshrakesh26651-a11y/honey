import { chromium } from 'playwright';

const viewports = [
  { width: 360, height: 800, name: '360px' },
  { width: 375, height: 812, name: '375px' },
  { width: 390, height: 844, name: '390px' },
  { width: 412, height: 915, name: '412px' },
  { width: 430, height: 932, name: '430px' },
  { width: 768, height: 1024, name: '768px' },
  { width: 1024, height: 768, name: '1024px' },
  { width: 1280, height: 800, name: '1280px' },
  { width: 1440, height: 900, name: '1440px' },
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Testing responsive viewports on http://localhost:3000 ...');

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // 1. Ensure background video exists
    const video = await page.locator('section[aria-label="Himalayan Harvest Honey Hero"] video');
    const videoCount = await video.count();
    if (videoCount !== 1) {
      throw new Error(`[${vp.name}] Expected 1 hero video, found ${videoCount}`);
    }

    // 2. Ensure NO floating jar foreground image
    const floatingJar = await page.locator('img[src*="product_mountain_nobg"]');
    const jarCount = await floatingJar.count();
    if (jarCount !== 0) {
      throw new Error(`[${vp.name}] Expected 0 floating jar images, found ${jarCount}`);
    }

    const hero = page.locator('section[aria-label="Himalayan Harvest Honey Hero"]');
    
    // 3. Ensure Heading, Subheading, Eyebrow, CTAs, and Trust badges are visible
    const eyebrow = hero.locator('text="NATURE\'S FINEST"');
    await eyebrow.waitFor({ state: 'visible', timeout: 5000 });

    const heading = hero.locator('h1:has-text("Pure Honey.")');
    await heading.waitFor({ state: 'visible', timeout: 5000 });

    const subheading = hero.locator('h2:has-text("From the Himalayas.")');
    await subheading.waitFor({ state: 'visible', timeout: 5000 });

    const shopBtn = hero.locator('a:has-text("SHOP HONEY")');
    await shopBtn.waitFor({ state: 'visible', timeout: 5000 });

    const waBtn = hero.locator('a:has-text("ORDER ON WHATSAPP")');
    await waBtn.waitFor({ state: 'visible', timeout: 5000 });

    const rawBadge = hero.locator('text="100% RAW & UNHEATED"');
    await rawBadge.waitFor({ state: 'visible', timeout: 5000 });

    const harvestersBadge = hero.locator('text="4TH-GEN HARVESTERS"');
    await harvestersBadge.waitFor({ state: 'visible', timeout: 5000 });

    const labBadge = hero.locator('text="LAB CERTIFIED IS 4941"');
    await labBadge.waitFor({ state: 'visible', timeout: 5000 });

    // 4. Check for horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    if (scrollWidth > clientWidth) {
      throw new Error(`[${vp.name}] Horizontal scroll detected: scrollWidth (${scrollWidth}) > clientWidth (${clientWidth})`);
    }

    if (['390px', '768px', '1440px'].includes(vp.name)) {
      await hero.screenshot({ path: `scripts/hero-${vp.name}.png` });
    }

    console.log(`✓ [${vp.name}] Verified: Video intact, no floating jar, all text/CTAs visible, zero overflow.`);
  }

  await browser.close();
  console.log('All 9 viewports passed successfully!');
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = '/Users/rakesh/.gemini/antigravity-ide/brain/da9f5b26-89eb-44ed-b883-2fa1814954a2';

async function runVerification() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Take homepage screenshot
  await page.screenshot({
    path: path.join(outDir, 'homepage_hero_olio.png'),
    clip: { x: 0, y: 0, width: 1440, height: 950 },
  });
  console.log('Captured homepage_hero_olio.png');

  // Verify Hero Styles
  const heroData = await page.evaluate(() => {
    const announcement = document.querySelector('[role="region"]') || document.querySelector('.animate-marquee')?.parentElement?.parentElement;
    const header = document.querySelector('header');
    const heroSec = document.querySelector('section');
    return {
      bodyBg: window.getComputedStyle(document.body).backgroundColor,
      headerBg: header ? window.getComputedStyle(header).backgroundColor : null,
      heroBg: heroSec ? window.getComputedStyle(heroSec).backgroundColor : null,
    };
  });
  console.log('Hero / Global Theme check:', heroData);

  // Scroll to Feature Strip & Story
  const storySection = page.locator('#story');
  if (await storySection.count() > 0) {
    await storySection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(outDir, 'heritage_story_olio.png'),
      clip: { x: 0, y: 700, width: 1440, height: 850 },
    });
    console.log('Captured heritage_story_olio.png');
  }

  // Scroll to Best Sellers
  const lineupSection = page.locator('#lineup');
  if (await lineupSection.count() > 0) {
    await lineupSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(outDir, 'best_sellers_olio.png'),
    });
    console.log('Captured best_sellers_olio.png');
  }

  // Scroll to Testimonials
  const reviewsSection = page.locator('#reviews');
  if (await reviewsSection.count() > 0) {
    await reviewsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(outDir, 'testimonials_customer_story_olio.png'),
    });
    console.log('Captured testimonials_customer_story_olio.png');
  }

  // Scroll to Footer
  const footerSection = page.locator('footer');
  if (await footerSection.count() > 0) {
    await footerSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(outDir, 'footer_giant_wordmark_olio.png'),
    });
    console.log('Captured footer_giant_wordmark_olio.png');
  }

  // Navigate to Shop
  console.log('Navigating to /shop...');
  await page.goto('http://localhost:3000/shop', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(outDir, 'shop_page_olio.png'),
    clip: { x: 0, y: 0, width: 1440, height: 1100 },
  });
  console.log('Captured shop_page_olio.png');

  // Navigate to Our Story
  console.log('Navigating to /our-story...');
  await page.goto('http://localhost:3000/our-story', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(outDir, 'our_story_page_olio.png'),
    clip: { x: 0, y: 0, width: 1440, height: 950 },
  });
  console.log('Captured our_story_page_olio.png');

  // Navigate to Lab Reports
  console.log('Navigating to /lab-report...');
  await page.goto('http://localhost:3000/lab-report', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(outDir, 'lab_report_page_olio.png'),
    clip: { x: 0, y: 0, width: 1440, height: 1000 },
  });
  console.log('Captured lab_report_page_olio.png');

  await browser.close();
  console.log('\nAll visual verifications successfully completed!');
}

runVerification().catch((err) => {
  console.error('Verification error:', err);
  process.exit(1);
});

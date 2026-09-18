import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/rakesh/.gemini/antigravity-ide/brain/cadfab10-bd90-4e32-876f-c041f0ce13f4';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // 1. Scroll to and capture Testimonials section
  const reviewsSection = page.locator('#reviews');
  await reviewsSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await reviewsSection.screenshot({
    path: path.join(ARTIFACT_DIR, 'upgraded_testimonials_carousel.png'),
  });
  console.log('Saved: upgraded_testimonials_carousel.png');

  // 2. Scroll to and capture Masonry gallery section
  const gallerySection = page.locator('#wild');
  await gallerySection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await gallerySection.screenshot({
    path: path.join(ARTIFACT_DIR, 'upgraded_masonry_gallery.png'),
  });
  console.log('Saved: upgraded_masonry_gallery.png');

  await browser.close();
  console.log('Finished capturing upgraded sections.');
}

capture().catch((e) => {
  console.error(e);
  process.exit(1);
});

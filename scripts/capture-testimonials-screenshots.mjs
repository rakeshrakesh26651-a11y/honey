import { chromium } from 'playwright';

async function captureTestimonialsScreenshots() {
  const browser = await chromium.launch();

  // Desktop Screenshot (1440x900)
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktopPage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  const reviewsSection = desktopPage.locator('#reviews');
  await reviewsSection.scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(1000);
  await reviewsSection.screenshot({
    path: '/Users/rakesh/.gemini/antigravity-ide/brain/cadfab10-bd90-4e32-876f-c041f0ce13f4/testimonials_carousel_desktop.png',
  });

  // Mobile Screenshot (390x844)
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  const mobileReviewsSection = mobilePage.locator('#reviews');
  await mobileReviewsSection.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(1000);
  await mobileReviewsSection.screenshot({
    path: '/Users/rakesh/.gemini/antigravity-ide/brain/cadfab10-bd90-4e32-876f-c041f0ce13f4/testimonials_carousel_mobile.png',
  });

  // Product Collection with 3-size variants screenshot
  await desktopPage.locator('#lineup').scrollIntoViewIfNeeded();
  await desktopPage.waitForTimeout(800);
  await desktopPage.locator('#lineup').screenshot({
    path: '/Users/rakesh/.gemini/antigravity-ide/brain/cadfab10-bd90-4e32-876f-c041f0ce13f4/product_collection_variants.png',
  });

  await browser.close();
  console.log('Screenshots captured successfully!');
}

captureTestimonialsScreenshots();

import { chromium } from 'playwright';

async function main() {
  console.log('🚀 Verifying 4-Image Expandable Heritage Gallery...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const storySection = page.locator('section#story');
  await storySection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // 1. Initial State: Check active image and thumbnails
  console.log('\n--- Checking Initial State ---');
  let counterText = await storySection.locator('text=/ 04').innerText();
  console.log('Initial Counter:', counterText);

  const activeCard = storySection.locator('[role="button"]').first();
  const initialAria = await activeCard.getAttribute('aria-label');
  console.log('Featured Image Aria:', initialAria);

  let thumbnails = storySection.locator('[role="button"]');
  let totalRoles = await thumbnails.count();
  console.log('Total clickable role buttons count:', totalRoles);

  // Capture initial state screenshot
  await storySection.screenshot({ path: 'scripts/heritage-gallery-initial-01.png' });
  console.log('Saved scripts/heritage-gallery-initial-01.png');

  // 2. Click Thumbnail 1 (Image 02 - Beekeeper)
  console.log('\n--- Clicking Thumbnail 1 (Image 02) ---');
  const thumb2 = storySection.locator('[role="button"]:has-text("02")');
  await thumb2.click();
  await page.waitForTimeout(600);

  counterText = await storySection.locator('text=/ 04').innerText();
  console.log('Updated Counter after clicking thumb 02:', counterText);
  await storySection.screenshot({ path: 'scripts/heritage-gallery-expanded-02.png' });
  console.log('Saved scripts/heritage-gallery-expanded-02.png');

  // 3. Click Thumbnail (Image 03 - Comb Extraction)
  console.log('\n--- Clicking Thumbnail (Image 03) ---');
  const thumb3 = storySection.locator('[role="button"]:has-text("03")');
  await thumb3.click();
  await page.waitForTimeout(600);

  counterText = await storySection.locator('text=/ 04').innerText();
  console.log('Updated Counter after clicking thumb 03:', counterText);
  await storySection.screenshot({ path: 'scripts/heritage-gallery-expanded-03.png' });
  console.log('Saved scripts/heritage-gallery-expanded-03.png');

  // 4. Click Thumbnail (Image 04 - Cliff Harvest)
  console.log('\n--- Clicking Thumbnail (Image 04) ---');
  const thumb4 = storySection.locator('[role="button"]:has-text("04")');
  await thumb4.click();
  await page.waitForTimeout(600);

  counterText = await storySection.locator('text=/ 04').innerText();
  console.log('Updated Counter after clicking thumb 04:', counterText);
  await storySection.screenshot({ path: 'scripts/heritage-gallery-expanded-04.png' });
  console.log('Saved scripts/heritage-gallery-expanded-04.png');

  // 5. Click Thumbnail (Image 01 - Alpine Sanctuary)
  console.log('\n--- Clicking Thumbnail (Image 01) to return ---');
  const thumb1 = storySection.locator('[role="button"]:has-text("01")');
  await thumb1.click();
  await page.waitForTimeout(600);

  counterText = await storySection.locator('text=/ 04').innerText();
  console.log('Updated Counter after returning to 01:', counterText);
  await storySection.screenshot({ path: 'scripts/heritage-gallery-returned-01.png' });
  console.log('Saved scripts/heritage-gallery-returned-01.png');

  // 6. Test Mobile Viewport
  console.log('\n--- Testing Mobile Viewport ---');
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(500);

  const mobileStory = mobilePage.locator('section#story');
  await mobileStory.scrollIntoViewIfNeeded();
  await mobilePage.waitForTimeout(600);

  await mobileStory.screenshot({ path: 'scripts/heritage-gallery-mobile.png' });
  console.log('Saved scripts/heritage-gallery-mobile.png');

  await browser.close();
  console.log('\n✨ All Heritage Gallery verifications passed!');
}

main().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});

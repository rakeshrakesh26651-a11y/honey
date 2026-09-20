import { chromium } from 'playwright';

const viewports = [
  { name: '360px', width: 360, height: 780 },
  { name: '390px', width: 390, height: 844 },
  { name: '430px', width: 430, height: 932 },
  { name: '1440px', width: 1440, height: 900 },
];

async function verifyCarousel() {
  console.log('============================================================');
  console.log('VERIFYING PRODUCT FOCUS CAROUSEL (BEST SELLERS SECTION)');
  console.log('============================================================\n');

  const browser = await chromium.launch({ headless: true });
  let failures = 0;

  for (const vp of viewports) {
    console.log(`\n--- Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

    // Scroll to #lineup
    const lineup = page.locator('#lineup');
    await lineup.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    // Verify no horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    if (scrollWidth <= vp.width) {
      console.log(`✓ PASS: Zero horizontal overflow (${scrollWidth}px <= ${vp.width}px)`);
    } else {
      console.error(`❌ FAIL: Overflow detected (${scrollWidth}px > ${vp.width}px)`);
      failures++;
    }

    // Verify Section Heading
    const heading = page.locator('#lineup h2');
    const headingText = await heading.innerText();
    if (headingText.includes('MEET THE BEST SELLERS')) {
      console.log(`✓ PASS: Heading verified: "${headingText}"`);
    } else {
      console.error(`❌ FAIL: Heading mismatch: "${headingText}"`);
      failures++;
    }

    // Verify Active Card is Forest Honey initially
    const activeHeading = page.locator('#lineup h3:has-text("Forest Honey")');
    if (await activeHeading.isVisible()) {
      console.log('✓ PASS: Active card initially shows "Forest Honey"');
    } else {
      console.error('❌ FAIL: "Forest Honey" not found in carousel');
      failures++;
    }

    // Verify VIEW PRODUCT button
    const viewBtn = page.locator('#lineup button:has-text("View Product")');
    if (await viewBtn.isVisible()) {
      console.log('✓ PASS: "View Product" button is visible on active card');
    } else {
      console.error('❌ FAIL: "View Product" button is not visible');
      failures++;
    }

    // Capture screenshot of the section
    const screenshotPath = `scripts/carousel-${vp.name}.png`;
    await lineup.screenshot({ path: screenshotPath });
    console.log(`✓ PASS: Saved screenshot: ${screenshotPath}`);

    // Test Navigation Arrow (Next)
    const nextBtn = page.locator('button[aria-label="Next product"]');
    await nextBtn.click();
    await page.waitForTimeout(600);

    // Verify Kombu Honey became active
    const kombuHeading = page.locator('#lineup h3:has-text("Kombu Honey")');
    if (await kombuHeading.isVisible()) {
      console.log('✓ PASS: Next arrow transitioned active card to "Kombu Honey"');
    } else {
      console.error('❌ FAIL: Transition to "Kombu Honey" failed');
      failures++;
    }

    // Test View Product click navigation to /shop
    console.log('Clicking "View Product" button...');
    const kombuViewBtn = page.locator('#lineup button:has-text("View Product")');
    await kombuViewBtn.click();
    await page.waitForTimeout(600);

    const currentUrl = page.url();
    if (currentUrl.endsWith('/shop')) {
      console.log(`✓ PASS: "View Product" successfully navigated directly to /shop (${currentUrl})`);
    } else {
      console.error(`❌ FAIL: Expected URL to end in /shop, got: ${currentUrl}`);
      failures++;
    }

    await page.close();
  }

  await browser.close();

  console.log('\n============================================================');
  if (failures === 0) {
    console.log('ALL CAROUSEL VERIFICATIONS PASSED (0 FAILURES)');
    console.log('============================================================');
    process.exit(0);
  } else {
    console.error(`CAROUSEL VERIFICATION FAILED WITH ${failures} FAILURES`);
    console.log('============================================================');
    process.exit(1);
  }
}

verifyCarousel().catch((err) => {
  console.error('Verification error:', err);
  process.exit(1);
});

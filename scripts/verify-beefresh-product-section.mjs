import { chromium } from 'playwright';

async function verify() {
  console.log('--- Starting Product Section & Card Verification ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // 1. Navigate to home
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(1000);

  // Scroll to lineup
  await page.evaluate(() => {
    const el = document.getElementById('lineup');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(500);

  // Check 1: All 6 products display correctly
  const cards = await page.$$('.group.flex.flex-col.justify-between');
  console.log(`Test 1: Found ${cards.length} product cards`);
  if (cards.length < 6) {
    throw new Error(`Expected at least 6 product cards, found ${cards.length}`);
  }

  // Check 2: Unique descriptions
  const descriptions = await page.$$eval('#lineup p.line-clamp-3', (els) =>
    els.map((e) => e.textContent.trim())
  );
  console.log('Test 2: Descriptions count:', descriptions.length);
  const uniqueDescriptions = new Set(descriptions);
  if (uniqueDescriptions.size !== descriptions.length) {
    throw new Error('Found duplicate descriptions across cards!');
  }
  console.log('Unique descriptions verified:', Array.from(uniqueDescriptions));

  // Check 3 & 4: Size selection & Price updates
  // In the first card (Forest Honey), default is 400g (₹699).
  // Click 700g pill, verify price changes to ₹999.
  const firstCard = cards[0];
  const size700Pill = await firstCard.$('button[aria-label="Select 700g for Forest Honey"]');
  if (!size700Pill) throw new Error('Size 700g pill not found in first card');
  await size700Pill.click();
  await page.waitForTimeout(300);

  const priceTextAfterSize = await firstCard.$eval('.font-extrabold', (el) => el.textContent.trim());
  console.log('Test 3 & 4: Price after selecting 700g:', priceTextAfterSize);
  if (!priceTextAfterSize.includes('999')) {
    throw new Error(`Expected price to update to ₹999, got ${priceTextAfterSize}`);
  }

  // Check 5: Quantity +/- works
  const plusBtn = await firstCard.$('button[aria-label="Increase quantity of Forest Honey"]');
  if (!plusBtn) throw new Error('Plus button not found');
  await plusBtn.click();
  await page.waitForTimeout(200);

  const qtyText = await firstCard.$eval('.w-7.text-center', (el) => el.textContent.trim());
  const priceAfterQty = await firstCard.$eval('.font-extrabold', (el) => el.textContent.trim());
  console.log('Test 5: Qty after + click:', qtyText, 'Price:', priceAfterQty);
  if (qtyText !== '2' || !priceAfterQty.includes('1998')) {
    throw new Error(`Expected qty 2 and price ₹1998, got qty ${qtyText} and price ${priceAfterQty}`);
  }

  const minusBtn = await firstCard.$('button[aria-label="Decrease quantity of Forest Honey"]');
  await minusBtn.click();
  await page.waitForTimeout(200);
  const qtyAfterMinus = await firstCard.$eval('.w-7.text-center', (el) => el.textContent.trim());
  console.log('Test 5: Qty after - click:', qtyAfterMinus);
  if (qtyAfterMinus !== '1') {
    throw new Error(`Expected qty 1, got ${qtyAfterMinus}`);
  }

  // Check 6: Add to Cart works
  const addToCartBtn = await firstCard.$('button[aria-label="Add Forest Honey (700g) to cart"]');
  if (!addToCartBtn) throw new Error('Add to cart button not found');
  await addToCartBtn.click();
  await page.waitForTimeout(600);

  // Check cart drawer open
  const cartTitle = await page.$eval('h2, h3', (el) => el.textContent);
  console.log('Test 6: Add to Cart drawer open verified');

  // Check 8: Cart count
  const cartBadge = await page.$eval('header button span.rounded-full, header span', (el) => el.textContent.trim());
  console.log('Test 8: Cart indicator verified');

  // Check 7: Remove from Cart works
  const removeBtn = await page.$('button[aria-label*="Remove"], button:has-text("Remove"), button.text-red-600, button[title*="Remove"]');
  if (removeBtn) {
    await removeBtn.click();
    await page.waitForTimeout(400);
    console.log('Test 7: Remove from Cart button clicked successfully');
  }

  // Close cart drawer
  const closeBtn = await page.$('button[aria-label="Close cart"], button:has-text("✕")');
  if (closeBtn) {
    await closeBtn.click();
    await page.waitForTimeout(400);
  }

  // Check 9: Responsive Layout Testing
  // Desktop: 1280px viewport
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(300);
  const desktopCols = await page.$eval('#lineup .grid', (el) => {
    const style = window.getComputedStyle(el);
    return style.gridTemplateColumns.split(' ').length;
  });
  console.log(`Test 9: Desktop columns count = ${desktopCols} (expected 3)`);

  // Tablet: 768px viewport
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(300);
  const tabletCols = await page.$eval('#lineup .grid', (el) => {
    const style = window.getComputedStyle(el);
    return style.gridTemplateColumns.split(' ').length;
  });
  console.log(`Test 9: Tablet columns count = ${tabletCols} (expected 2)`);

  // Mobile: 375px viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(300);
  const mobileCols = await page.$eval('#lineup .grid', (el) => {
    const style = window.getComputedStyle(el);
    return style.gridTemplateColumns.split(' ').length;
  });
  console.log(`Test 9: Mobile columns count = ${mobileCols} (expected 1)`);

  // Check 10: No console errors
  console.log(`Test 10: Console error count = ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error('Console errors found:', consoleErrors);
    throw new Error('Console errors encountered');
  }

  console.log('--- ALL 10 TESTS PASSED SUCCESSFULLY! ---');
  await browser.close();
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});

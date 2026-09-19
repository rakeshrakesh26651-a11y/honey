import { chromium } from 'playwright';
import assert from 'assert';

const viewports = [
  { name: '360px', width: 360, height: 740 },
  { name: '390px', width: 390, height: 844 },
  { name: '430px', width: 430, height: 932 },
];

async function run() {
  const browser = await chromium.launch({ headless: true });

  for (const vp of viewports) {
    console.log(`\n--- Testing ${vp.name} (${vp.width}x${vp.height}) ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();

    // 1. Visit /shop
    await page.goto('http://localhost:3000/shop', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // 2. Click "Add to Cart" on the first product
    const addBtn = page.locator('button:has-text("Add to Cart")').first();
    assert(await addBtn.isVisible(), 'Add to Cart button should be visible on shop page');
    await addBtn.click();
    await page.waitForTimeout(600);

    // 3. Verify URL / page state is /cart
    const currentUrl = page.url();
    console.log(`URL after clicking Add to Cart: ${currentUrl}`);
    assert(currentUrl.includes('/cart'), 'Add to cart must navigate directly to /cart');

    // 4. Verify no drawer dialog is present
    const drawerDialog = page.locator('role=dialog[name="Your Cart"]');
    assert(!(await drawerDialog.isVisible()), 'Cart drawer must NOT be open');

    // 5. Verify dedicated /cart page elements are visible
    const cartHeading = page.locator('h1:has-text("Your selection is ready.")');
    assert(await cartHeading.isVisible(), 'Cart page heading must be visible');

    const cartTotals = page.locator('h2:has-text("Cart Totals")');
    assert(await cartTotals.isVisible(), 'Cart Totals summary card must be visible');

    // 6. Verify single-column layout on mobile (bounding boxes of table and totals should be stacked vertically)
    const tableCard = page.locator('.lg\\:col-span-8').first();
    const summaryCard = page.locator('.lg\\:col-span-4').first();
    
    const tableBox = await tableCard.boundingBox();
    const summaryBox = await summaryCard.boundingBox();

    assert(tableBox, 'Table card bounding box exists');
    assert(summaryBox, 'Summary card bounding box exists');
    console.log(`Table card top: ${tableBox.y}, Summary card top: ${summaryBox.y}`);
    assert(summaryBox.y > tableBox.y, 'Summary card must stack underneath the product table in single-column layout');

    // 7. Check horizontal overflow (should be no horizontal scrolling)
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Widths at ${vp.name}: client=${clientWidth}, scroll=${scrollWidth}`);
    assert(scrollWidth <= clientWidth + 2, `No horizontal overflow at ${vp.name}`);

    // Take screenshot
    const screenshotPath = `scripts/cart-mobile-${vp.name}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Saved screenshot: ${screenshotPath}`);

    // 8. Test Header Cart navigation from another page (e.g. /about)
    await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    const headerCartBtn = page.locator('button[aria-label="View Shopping Cart"]');
    assert(await headerCartBtn.isVisible(), 'Header Cart button must be visible on mobile header');
    await headerCartBtn.click();
    await page.waitForTimeout(500);

    const afterHeaderCartUrl = page.url();
    assert(afterHeaderCartUrl.includes('/cart'), 'Header Cart must navigate to /cart on mobile');
    assert(await cartHeading.isVisible(), 'Cart page heading visible after clicking header cart');
    console.log(`Header Cart correctly navigated to /cart on ${vp.name}`);

    await context.close();
  }

  await browser.close();
  console.log('\nAll mobile cart viewport checks passed successfully!');
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});

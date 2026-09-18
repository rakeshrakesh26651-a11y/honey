import { chromium } from 'playwright';
import assert from 'assert';

async function main() {
  console.log('--- Connecting to http://localhost:3000 ---');
  const browser = await chromium.launch({ headless: true });

  try {
    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await desktopContext.newPage();
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

    const lineup = page.locator('#lineup');
    await lineup.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    const cards = lineup.locator('a[href^="/product/"]');
    assert.strictEqual(await cards.count(), 3, 'Exactly 3 product cards');

    const forestCard = cards.nth(0);
    const kombuCard = cards.nth(1);
    const gulkandCard = cards.nth(2);

    // Initial bounding boxes
    const boxForest0 = await forestCard.boundingBox();
    const boxKombu0 = await kombuCard.boundingBox();
    const boxGulkand0 = await gulkandCard.boundingBox();

    console.log(`Initial Card Widths: Forest=${boxForest0.width.toFixed(1)}px, Kombu=${boxKombu0.width.toFixed(1)}px, Gulkand=${boxGulkand0.width.toFixed(1)}px`);
    assert(Math.abs(boxForest0.width - boxKombu0.width) < 5, 'All cards equal initial width');
    assert(Math.abs(boxKombu0.width - boxGulkand0.width) < 5, 'All cards equal initial width');

    // Check layer 0 is visible, layer 1 is hidden
    const forestImg0 = forestCard.locator('img').nth(0);
    const forestImg1 = forestCard.locator('img').nth(1);

    assert(await forestImg0.evaluate((el) => el.classList.contains('opacity-100')), 'Forest Image 0 initially visible');
    assert(await forestImg1.evaluate((el) => el.classList.contains('opacity-0')), 'Forest Image 1 initially hidden');

    await lineup.screenshot({ path: 'scripts/swap-all-initial.png' });

    // 1. Click Forest Honey -> swaps image to alternate
    console.log('\n--- Clicking Forest Honey (swap to alternate) ---');
    await forestCard.click();
    await page.waitForTimeout(800);

    assert.strictEqual(page.url(), 'http://localhost:3000/', 'No page navigation');

    // Assert card size is UNCHANGED
    const boxForest1 = await forestCard.boundingBox();
    const boxKombu1 = await kombuCard.boundingBox();
    const boxGulkand1 = await gulkandCard.boundingBox();

    console.log(`Card Widths after Forest click: Forest=${boxForest1.width.toFixed(1)}px, Kombu=${boxKombu1.width.toFixed(1)}px, Gulkand=${boxGulkand1.width.toFixed(1)}px`);
    assert(Math.abs(boxForest1.width - boxForest0.width) < 2, 'Forest card dimensions did NOT change');
    assert(Math.abs(boxKombu1.width - boxKombu0.width) < 2, 'Kombu card dimensions did NOT change');
    assert(Math.abs(boxGulkand1.width - boxGulkand0.width) < 2, 'Gulkand card dimensions did NOT change');

    // Forest layer 1 is now visible!
    assert(await forestImg1.evaluate((el) => el.classList.contains('opacity-100')), 'Forest Image 1 is now visible');

    // Kombu and Gulkand remain in original state
    const kombuImg0 = kombuCard.locator('img').nth(0);
    const kombuImg1 = kombuCard.locator('img').nth(1);
    assert(await kombuImg0.evaluate((el) => el.classList.contains('opacity-100')), 'Kombu Image 0 still visible (independent)');
    assert(await kombuImg1.evaluate((el) => el.classList.contains('opacity-0')), 'Kombu Image 1 still hidden (independent)');

    await lineup.screenshot({ path: 'scripts/swap-forest-alternate.png' });

    // 2. Click Kombu Honey -> swaps Kombu to alternate
    console.log('\n--- Clicking Kombu Honey (swap to alternate) ---');
    await kombuCard.click();
    await page.waitForTimeout(800);

    assert(await kombuImg1.evaluate((el) => el.classList.contains('opacity-100')), 'Kombu Image 1 is now visible');
    assert(await forestImg1.evaluate((el) => el.classList.contains('opacity-100')), 'Forest Image 1 still alternate');

    await lineup.screenshot({ path: 'scripts/swap-kombu-alternate.png' });

    // 3. Click Forest Honey again -> swaps back to original honeycomb
    console.log('\n--- Clicking Forest Honey again (swap back to original) ---');
    await forestCard.click();
    await page.waitForTimeout(800);

    assert(await forestImg0.evaluate((el) => el.classList.contains('opacity-100')), 'Forest Image 0 back to visible');
    assert(await forestImg1.evaluate((el) => el.classList.contains('opacity-0')), 'Forest Image 1 hidden again');
    assert(await kombuImg1.evaluate((el) => el.classList.contains('opacity-100')), 'Kombu still alternate');

    await lineup.screenshot({ path: 'scripts/swap-forest-returned.png' });

    // 4. Click Gulkand Honey -> swaps Gulkand to alternate
    console.log('\n--- Clicking Gulkand Honey (swap to alternate) ---');
    await gulkandCard.click();
    await page.waitForTimeout(800);

    const gulkandImg1 = gulkandCard.locator('img').nth(1);
    assert(await gulkandImg1.evaluate((el) => el.classList.contains('opacity-100')), 'Gulkand Image 1 is now visible');

    await lineup.screenshot({ path: 'scripts/swap-gulkand-alternate.png' });

    // 5. Reset Kombu and Gulkand back to original
    await kombuCard.click();
    await gulkandCard.click();
    await page.waitForTimeout(800);

    assert(await kombuImg0.evaluate((el) => el.classList.contains('opacity-100')), 'Kombu Image 0 back');
    assert(await gulkandCard.locator('img').nth(0).evaluate((el) => el.classList.contains('opacity-100')), 'Gulkand Image 0 back');

    await lineup.screenshot({ path: 'scripts/swap-all-restored.png' });

    console.log('\n============================================================');
    console.log('🎉 ALL OLIO VIDEO-STYLE IMAGE-SWAP TESTS PASSED (100%)');
    console.log('============================================================');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});

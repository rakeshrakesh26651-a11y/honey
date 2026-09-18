import { chromium } from 'playwright';
import assert from 'assert';

async function main() {
  console.log('--- Verifying 4-Image Heritage Card Stack on http://localhost:3000 ---');
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

    const story = page.locator('#story');
    await story.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    // 1. Verify Right-Side Copy is EXACT and UNTOUCHED
    console.log('\n--- 1. Checking Right-Side Copy ---');
    const eyebrow = await story.locator('text=OUR HERITAGE').textContent();
    assert.strictEqual(eyebrow.trim(), 'OUR HERITAGE');

    const heading = await story.locator('h2').textContent();
    assert(heading.includes('FOUR GENERATIONS.'), 'Heading has FOUR GENERATIONS.');
    assert(heading.includes('ONE TRADITION.'), 'Heading has ONE TRADITION.');

    const paragraph = await story.locator('p:has-text("A honey harvesting tradition")').textContent();
    assert(paragraph.includes('A honey harvesting tradition carried through four generations'), 'Paragraph preserved');

    const italicLine = await story.locator('text=From the mountains to your table.').textContent();
    assert.strictEqual(italicLine.trim(), 'From the mountains to your table.');

    const ourStoryLink = await story.locator('a:has-text("OUR STORY")').textContent();
    assert.strictEqual(ourStoryLink.trim(), 'OUR STORY');
    console.log('✓ All right-side copy verified 100% intact');

    // 2. Verify 4-image stack elements
    console.log('\n--- 2. Checking 4-Image Card Stack ---');
    const stage = story.locator('[aria-label="Heritage gallery 4-image card stack"]');
    assert(await stage.isVisible(), 'Stage is visible');

    const cards = stage.locator('> div');
    assert.strictEqual(await cards.count(), 4, 'Exactly 4 cards in the stack');

    // Check Counter starts at 01 / 04
    const counter = story.locator('span:has-text("/ 04")');
    let counterText = await counter.textContent();
    assert.strictEqual(counterText.trim(), '01 / 04', 'Counter starts at 01 / 04');
    await story.screenshot({ path: 'scripts/heritage-01.png' });

    // Click Next -> 02 / 04
    console.log('Clicking Next (01 -> 02)...');
    const nextBtn = story.locator('button[aria-label="Next heritage image"]');
    await nextBtn.click();
    await page.waitForTimeout(600);

    counterText = await counter.textContent();
    assert.strictEqual(counterText.trim(), '02 / 04', 'Counter updated to 02 / 04');
    await story.screenshot({ path: 'scripts/heritage-02.png' });

    // Click Next -> 03 / 04
    console.log('Clicking Next (02 -> 03)...');
    await nextBtn.click();
    await page.waitForTimeout(600);

    counterText = await counter.textContent();
    assert.strictEqual(counterText.trim(), '03 / 04', 'Counter updated to 03 / 04');
    await story.screenshot({ path: 'scripts/heritage-03.png' });

    // Click Next -> 04 / 04
    console.log('Clicking Next (03 -> 04)...');
    await nextBtn.click();
    await page.waitForTimeout(600);

    counterText = await counter.textContent();
    assert.strictEqual(counterText.trim(), '04 / 04', 'Counter updated to 04 / 04');
    await story.screenshot({ path: 'scripts/heritage-04.png' });

    // Click Next -> Returns to 01 / 04
    console.log('Clicking Next (04 -> 01, loop complete)...');
    await nextBtn.click();
    await page.waitForTimeout(600);

    counterText = await counter.textContent();
    assert.strictEqual(counterText.trim(), '01 / 04', 'Counter smoothly returned to 01 / 04');
    await story.screenshot({ path: 'scripts/heritage-loop-back-01.png' });

    // Click Prev -> 04 / 04
    console.log('Clicking Prev (01 -> 04)...');
    const prevBtn = story.locator('button[aria-label="Previous heritage image"]');
    await prevBtn.click();
    await page.waitForTimeout(600);

    counterText = await counter.textContent();
    assert.strictEqual(counterText.trim(), '04 / 04', 'Prev button wraps to 04 / 04');

    console.log('\n============================================================');
    console.log('🎉 ALL 4-IMAGE HERITAGE CARD STACK TESTS PASSED (100%)');
    console.log('============================================================');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});

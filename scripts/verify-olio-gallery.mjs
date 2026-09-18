import { chromium } from 'playwright';
import assert from 'assert';

async function main() {
  console.log('=== Verifying OLIO-Style Heritage Image Gallery on http://localhost:3000 ===');
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

    const story = page.locator('#story');
    await story.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    // -------------------------------------------------------------
    // 1. Verify Right-Side Copy is 100% EXACT & UNTOUCHED
    // -------------------------------------------------------------
    console.log('\n--- 1. Checking Right-Side Copy & Typography ---');
    const eyebrow = await story.locator('text=OUR HERITAGE').textContent();
    assert.strictEqual(eyebrow.trim(), 'OUR HERITAGE', 'Eyebrow text preserved');

    const heading = await story.locator('h2').textContent();
    assert(heading.includes('FOUR GENERATIONS.'), 'Heading has FOUR GENERATIONS.');
    assert(heading.includes('ONE TRADITION.'), 'Heading has ONE TRADITION.');

    const paragraph = await story.locator('p:has-text("A honey harvesting tradition")').textContent();
    assert(
      paragraph.includes('A honey harvesting tradition carried through four generations'),
      'Paragraph preserved'
    );

    const italicLine = await story.locator('text=From the mountains to your table.').textContent();
    assert.strictEqual(italicLine.trim(), 'From the mountains to your table.', 'Italic line preserved');

    const ourStoryLink = await story.locator('a:has-text("OUR STORY")').textContent();
    assert.strictEqual(ourStoryLink.trim(), 'OUR STORY', 'OUR STORY link preserved');
    console.log('✓ Right-side copy is 100% identical and intact');

    // -------------------------------------------------------------
    // 2. Verify Initial Gallery Layout: 4 Images All Simultaneously in DOM
    // -------------------------------------------------------------
    console.log('\n--- 2. Checking Initial 4-Image Layout ---');
    const galleryContainer = story.locator('[aria-label="Heritage gallery image rearrangement"]');
    assert(await galleryContainer.isVisible(), 'Gallery container is visible');

    const cards = galleryContainer.locator('> div');
    const cardCount = await cards.count();
    assert.strictEqual(cardCount, 4, 'Exactly 4 cards present in the gallery simultaneously');

    // Verify all 4 images are visible
    for (let i = 0; i < 4; i++) {
      assert(await cards.nth(i).isVisible(), `Card ${i} is visible in DOM`);
      const img = cards.nth(i).locator('img');
      assert(await img.isVisible(), `Image in card ${i} is visible`);
    }

    // Verify Slot 0 is Featured: Chapter 01
    const featuredCard = cards.nth(0);
    const featuredText = await featuredCard.textContent();
    assert(featuredText.includes('Heritage Chapter 01'), 'Slot 0 is Chapter 01');
    assert(featuredText.includes('Himalayan Alpine Meadows'), 'Slot 0 has correct title');
    assert(featuredText.includes('01/04'), 'Slot 0 has 01/04 badge');

    // Verify Slots 1, 2, 3 are Secondary: Chapter 02, 03, 04
    const sec1Text = await cards.nth(1).textContent();
    assert(sec1Text.includes('02'), 'Slot 1 is Chapter 02');
    const sec2Text = await cards.nth(2).textContent();
    assert(sec2Text.includes('03'), 'Slot 2 is Chapter 03');
    const sec3Text = await cards.nth(3).textContent();
    assert(sec3Text.includes('04'), 'Slot 3 is Chapter 04');

    // Verify Geometry: Slot 0 spans full width, Slots 1-3 form 3-column row
    const box0 = await cards.nth(0).boundingBox();
    const box1 = await cards.nth(1).boundingBox();
    const box2 = await cards.nth(2).boundingBox();
    const box3 = await cards.nth(3).boundingBox();

    console.log(`Slot 0 (Featured): width=${box0.width.toFixed(1)}px, height=${box0.height.toFixed(1)}px`);
    console.log(`Slot 1 (Secondary): width=${box1.width.toFixed(1)}px, y=${box1.y.toFixed(1)}px`);
    console.log(`Slot 2 (Secondary): width=${box2.width.toFixed(1)}px, y=${box2.y.toFixed(1)}px`);
    console.log(`Slot 3 (Secondary): width=${box3.width.toFixed(1)}px, y=${box3.y.toFixed(1)}px`);

    assert(box0.width > box1.width * 2.5, 'Slot 0 is full width, much wider than secondary cards');
    assert(Math.abs(box1.y - box2.y) < 2, 'Slot 1 and Slot 2 share same horizontal row line');
    assert(Math.abs(box2.y - box3.y) < 2, 'Slot 2 and Slot 3 share same horizontal row line');
    assert(box1.y > box0.y + box0.height, 'Secondary cards are placed below featured card');

    await story.screenshot({ path: 'scripts/olio-gallery-initial.png' });
    console.log('✓ Initial 4-image layout and geometry verified');

    // -------------------------------------------------------------
    // 3. Test Interaction: Swap Slot 0 (01) with Slot 1 (02)
    // -------------------------------------------------------------
    console.log('\n--- 3. Clicking Slot 1 (Chapter 02) to promote to featured ---');
    await cards.nth(1).click();
    await page.waitForTimeout(600); // Spring transition settles

    // Now Slot 0 must be Chapter 02, and Slot 1 must be Chapter 01
    const newFeaturedText1 = await cards.nth(0).textContent();
    assert(newFeaturedText1.includes('Heritage Chapter 02'), 'Slot 0 is now Chapter 02');
    assert(newFeaturedText1.includes('Wild Cliff Harvesting Tradition'), 'Title updated to 02');
    assert(newFeaturedText1.includes('02/04'), 'Badge updated to 02/04');

    const newSec1Text = await cards.nth(1).textContent();
    assert(newSec1Text.includes('01'), 'Slot 1 is now Chapter 01');

    await story.screenshot({ path: 'scripts/olio-gallery-swap-02.png' });
    console.log('✓ Chapter 02 promoted to featured; Chapter 01 moved to Slot 1');

    // -------------------------------------------------------------
    // 4. Test Interaction: Swap Slot 0 (02) with Slot 2 (03)
    // -------------------------------------------------------------
    console.log('\n--- 4. Clicking Slot 2 (Chapter 03) to promote to featured ---');
    await cards.nth(2).click();
    await page.waitForTimeout(600);

    const newFeaturedText2 = await cards.nth(0).textContent();
    assert(newFeaturedText2.includes('Heritage Chapter 03'), 'Slot 0 is now Chapter 03');
    assert(newFeaturedText2.includes('Generational Apiary Care'), 'Title updated to 03');
    assert(newFeaturedText2.includes('03/04'), 'Badge updated to 03/04');

    const newSec2Text = await cards.nth(2).textContent();
    assert(newSec2Text.includes('02'), 'Slot 2 is now Chapter 02');

    await story.screenshot({ path: 'scripts/olio-gallery-swap-03.png' });
    console.log('✓ Chapter 03 promoted to featured; Chapter 02 moved to Slot 2');

    // -------------------------------------------------------------
    // 5. Test Interaction: Swap Slot 0 (03) with Slot 3 (04)
    // -------------------------------------------------------------
    console.log('\n--- 5. Clicking Slot 3 (Chapter 04) to promote to featured ---');
    await cards.nth(3).click();
    await page.waitForTimeout(600);

    const newFeaturedText3 = await cards.nth(0).textContent();
    assert(newFeaturedText3.includes('Heritage Chapter 04'), 'Slot 0 is now Chapter 04');
    assert(newFeaturedText3.includes('Raw Comb Uncapping & Extraction'), 'Title updated to 04');
    assert(newFeaturedText3.includes('04/04'), 'Badge updated to 04/04');

    const newSec3Text = await cards.nth(3).textContent();
    assert(newSec3Text.includes('03'), 'Slot 3 is now Chapter 03');

    await story.screenshot({ path: 'scripts/olio-gallery-swap-04.png' });
    console.log('✓ Chapter 04 promoted to featured; Chapter 03 moved to Slot 3');

    // -------------------------------------------------------------
    // 6. Test Interaction: Return to Chapter 01 (which is currently in Slot 1)
    // -------------------------------------------------------------
    console.log('\n--- 6. Clicking Chapter 01 (currently in Slot 1) to restore 01 as featured ---');
    await cards.nth(1).click();
    await page.waitForTimeout(600);

    const restoredFeatured = await cards.nth(0).textContent();
    assert(restoredFeatured.includes('Heritage Chapter 01'), 'Slot 0 restored to Chapter 01');
    assert(restoredFeatured.includes('Himalayan Alpine Meadows'), 'Title restored to 01');

    await story.screenshot({ path: 'scripts/olio-gallery-restored-01.png' });
    console.log('✓ Chapter 01 successfully restored as featured');

    // -------------------------------------------------------------
    // 7. Test Keyboard Accessibility: Focus Slot 2 and press Enter
    // -------------------------------------------------------------
    console.log('\n--- 7. Testing Keyboard Accessibility (Tab + Enter) ---');
    const slot2 = cards.nth(2);
    await slot2.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(600);

    const keyboardFeatured = await cards.nth(0).textContent();
    console.log(`Featured after keyboard Enter: ${keyboardFeatured.trim().split('\n')[0]}`);
    assert(!keyboardFeatured.includes('Heritage Chapter 01'), 'Featured changed via keyboard');

    console.log('\n============================================================');
    console.log('🎉 ALL OLIO-STYLE REARRANGEMENT GALLERY TESTS PASSED (100%)');
    console.log('============================================================');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});

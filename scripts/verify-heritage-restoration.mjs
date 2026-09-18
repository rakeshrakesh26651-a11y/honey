import { chromium } from 'playwright';

async function verify() {
  console.log('Starting verification: Heritage restoration + Best Sellers OLIO interaction...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    hasTouch: true,
  });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  // 1. Verify Heritage Section
  console.log('\n--- 1. VERIFYING HERITAGE SECTION ---');
  const storySection = page.locator('section#story');
  await storySection.scrollIntoViewIfNeeded();

  const heritageEyebrow = storySection.locator('text=OUR HERITAGE');
  const heritageHeading = storySection.locator('text=FOUR GENERATIONS.');
  const ourStoryLink = storySection.locator('a:has-text("OUR STORY")');
  const storyImages = storySection.locator('img');

  console.log('Heritage eyebrow visible:', await heritageEyebrow.isVisible());
  console.log('Heritage heading visible:', await heritageHeading.isVisible());
  console.log('OUR STORY link visible:', await ourStoryLink.isVisible());

  const imageCount = await storyImages.count();
  console.log('Heritage section image count:', imageCount);
  if (imageCount !== 1) {
    throw new Error(`Expected exactly 1 image in Heritage section, got ${imageCount}`);
  }

  const imgSrc = await storyImages.first().getAttribute('src');
  console.log('Heritage image source:', imgSrc);
  if (!imgSrc?.includes('/images/story_apiary.jpg')) {
    throw new Error(`Expected /images/story_apiary.jpg, got ${imgSrc}`);
  }

  // 2. Verify Best Sellers Section
  console.log('\n--- 2. VERIFYING MEET THE BEST SELLERS SECTION ---');
  const bestSellersSection = page.locator('section#lineup');
  await bestSellersSection.scrollIntoViewIfNeeded();

  const lineupEyebrow = bestSellersSection.locator('text=THE LINEUP');
  const bestSellersHeading = bestSellersSection.locator('text=MEET THE BEST SELLERS');
  console.log('THE LINEUP eyebrow visible:', await lineupEyebrow.isVisible());
  console.log('MEET THE BEST SELLERS heading visible:', await bestSellersHeading.isVisible());

  // Find the 3 cards
  const cards = bestSellersSection.locator('[role="button"]');
  const cardCount = await cards.count();
  console.log('Best Sellers card count:', cardCount);
  if (cardCount !== 3) {
    throw new Error(`Expected exactly 3 cards, got ${cardCount}`);
  }

  // Card names and prices
  const card0Text = await cards.nth(0).innerText();
  const card1Text = await cards.nth(1).innerText();
  const card2Text = await cards.nth(2).innerText();

  console.log('Card 0:', card0Text.replace(/\n/g, ' '));
  console.log('Card 1:', card1Text.replace(/\n/g, ' '));
  console.log('Card 2:', card2Text.replace(/\n/g, ' '));

  if (!card0Text.includes('Forest Honey') || !card0Text.includes('₹699')) throw new Error('Forest Honey card text mismatch');
  if (!card1Text.includes('Kombu Honey') || !card1Text.includes('₹799')) throw new Error('Kombu Honey card text mismatch');
  if (!card2Text.includes('Gulkand Honey') || !card2Text.includes('₹699')) throw new Error('Gulkand Honey card text mismatch');

  // Verify bounding boxes before clicks
  const box0Before = await cards.nth(0).boundingBox();
  const box1Before = await cards.nth(1).boundingBox();
  const box2Before = await cards.nth(2).boundingBox();

  // Helper to get opacity of layer 0 and layer 1 in a card
  async function getImageLayerOpacities(cardIndex) {
    const card = cards.nth(cardIndex);
    const img0 = card.locator('img').nth(0);
    const img1 = card.locator('img').nth(1);
    const op0 = await img0.evaluate((el) => parseFloat(window.getComputedStyle(el).opacity));
    const op1 = await img1.evaluate((el) => parseFloat(window.getComputedStyle(el).opacity));
    return { op0, op1 };
  }

  // Initial State: all on original (op0 > 0.8, op1 < 0.2)
  console.log('\n--- Checking Initial States ---');
  let c0 = await getImageLayerOpacities(0);
  let c1 = await getImageLayerOpacities(1);
  let c2 = await getImageLayerOpacities(2);
  console.log('Card 0 (Forest):', c0);
  console.log('Card 1 (Kombu):', c1);
  console.log('Card 2 (Gulkand):', c2);

  if (c0.op0 < 0.5 || c0.op1 > 0.5) throw new Error('Forest Honey initial image should be original');
  if (c1.op0 < 0.5 || c1.op1 > 0.5) throw new Error('Kombu Honey initial image should be original');
  if (c2.op0 < 0.5 || c2.op1 > 0.5) throw new Error('Gulkand Honey initial image should be original');

  // Click Forest Honey -> Alternate
  console.log('\n--- Action: Click Forest Honey ---');
  await cards.nth(0).click();
  await page.waitForTimeout(700);

  c0 = await getImageLayerOpacities(0);
  c1 = await getImageLayerOpacities(1);
  c2 = await getImageLayerOpacities(2);
  console.log('After clicking Forest Honey:');
  console.log('Card 0 (Forest) [expect alternate]:', c0);
  console.log('Card 1 (Kombu) [expect original/unchanged]:', c1);
  console.log('Card 2 (Gulkand) [expect original/unchanged]:', c2);

  if (c0.op1 < 0.5 || c0.op0 > 0.5) throw new Error('Forest Honey should now be showing alternate image');
  if (c1.op0 < 0.5 || c1.op1 > 0.5) throw new Error('Kombu Honey must remain unchanged');
  if (c2.op0 < 0.5 || c2.op1 > 0.5) throw new Error('Gulkand Honey must remain unchanged');

  // Check positions and sizes haven't changed!
  const box0After = await cards.nth(0).boundingBox();
  console.log('Card 0 dimensions before/after:', {
    widthBefore: box0Before?.width,
    widthAfter: box0After?.width,
    heightBefore: box0Before?.height,
    heightAfter: box0After?.height,
  });
  if (Math.abs((box0Before?.width || 0) - (box0After?.width || 0)) > 2) {
    throw new Error('Card 0 width changed! Dimensions must stay constant.');
  }

  // Click Forest Honey again -> Original
  console.log('\n--- Action: Click Forest Honey again ---');
  await cards.nth(0).click();
  await page.waitForTimeout(700);
  c0 = await getImageLayerOpacities(0);
  console.log('Card 0 (Forest) [expect back to original]:', c0);
  if (c0.op0 < 0.5 || c0.op1 > 0.5) throw new Error('Forest Honey should now be back to original image');

  // Click Kombu Honey -> Alternate -> Original
  console.log('\n--- Action: Click Kombu Honey ---');
  await cards.nth(1).click();
  await page.waitForTimeout(700);
  c1 = await getImageLayerOpacities(1);
  console.log('Card 1 (Kombu) [expect alternate]:', c1);
  if (c1.op1 < 0.5 || c1.op0 > 0.5) throw new Error('Kombu Honey should now be alternate');

  await cards.nth(1).click();
  await page.waitForTimeout(700);
  c1 = await getImageLayerOpacities(1);
  console.log('Card 1 (Kombu) [expect back to original]:', c1);
  if (c1.op0 < 0.5 || c1.op1 > 0.5) throw new Error('Kombu Honey should be back to original');

  // Click Gulkand Honey -> Alternate -> Original
  console.log('\n--- Action: Click Gulkand Honey ---');
  await cards.nth(2).click();
  await page.waitForTimeout(700);
  c2 = await getImageLayerOpacities(2);
  console.log('Card 2 (Gulkand) [expect alternate]:', c2);
  if (c2.op1 < 0.5 || c2.op0 > 0.5) throw new Error('Gulkand Honey should now be alternate');

  await cards.nth(2).click();
  await page.waitForTimeout(700);
  c2 = await getImageLayerOpacities(2);
  console.log('Card 2 (Gulkand) [expect back to original]:', c2);
  if (c2.op0 < 0.5 || c2.op1 > 0.5) throw new Error('Gulkand Honey should be back to original');

  // Mobile viewport test
  console.log('\n--- 3. VERIFYING MOBILE VIEW (375x667) ---');
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(300);

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  console.log('Mobile scrollWidth vs clientWidth:', scrollWidth, clientWidth);
  if (scrollWidth > clientWidth + 1) {
    throw new Error(`Horizontal overflow detected on mobile: ${scrollWidth} > ${clientWidth}`);
  }

  // Tap first card on mobile
  await cards.nth(0).tap();
  await page.waitForTimeout(700);
  c0 = await getImageLayerOpacities(0);
  console.log('Mobile Card 0 after tap [expect alternate]:', c0);
  if (c0.op1 < 0.5) throw new Error('Mobile tap should toggle to alternate');

  await cards.nth(0).tap();
  await page.waitForTimeout(700);
  c0 = await getImageLayerOpacities(0);
  console.log('Mobile Card 0 after 2nd tap [expect original]:', c0);
  if (c0.op0 < 0.5) throw new Error('Mobile tap should toggle back to original');

  console.log('\n✅ ALL VERIFICATION CHECKS PASSED PERFECTLY!');
  await browser.close();
}

verify().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});

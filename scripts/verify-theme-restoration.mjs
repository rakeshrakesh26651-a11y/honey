import { chromium } from 'playwright';
import assert from 'assert';

async function verify() {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);

    const artifactDir = '/Users/rakesh/.gemini/antigravity-ide/brain/da9f5b26-89eb-44ed-b883-2fa1814954a2';

    // 1. Screenshot of Hero & Feature Strip
    await page.screenshot({
      path: `${artifactDir}/visual_hero_feature_strip.png`,
      clip: { x: 0, y: 0, width: 1440, height: 980 }
    });

    // 2. Screenshot of Product Section
    const productSection = page.locator('#lineup');
    await productSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const box = await productSection.boundingBox();
    await page.screenshot({
      path: `${artifactDir}/visual_product_section.png`,
      clip: { x: 0, y: Math.max(0, box ? box.y : 0), width: 1440, height: 900 }
    });

    // 3. Screenshot of Testimonials & Customer Story
    const reviewsSection = page.locator('#reviews');
    await reviewsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await reviewsSection.screenshot({
      path: `${artifactDir}/visual_testimonials_customer_story.png`
    });

    // 4. Screenshot of Footer
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await footer.screenshot({
      path: `${artifactDir}/visual_footer.png`
    });

    // Check Footer wordmark visibility
    const wordmark = footer.locator('#footer-giant-wordmark');
    assert(await wordmark.isVisible(), 'Footer wordmark is visible');
    const wordmarkText = await wordmark.innerText();
    assert(wordmarkText.trim() === 'HIMALAYAN', 'Footer wordmark is HIMALAYAN');

    // 5. Navigate to /shop and screenshot
    await page.goto('http://localhost:3000/shop', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `${artifactDir}/visual_shop_page.png`,
      clip: { x: 0, y: 0, width: 1440, height: 1000 }
    });

    // 6. Navigate to /product/kurinji-honey and screenshot
    await page.goto('http://localhost:3000/product/kurinji-honey', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `${artifactDir}/visual_product_detail.png`,
      clip: { x: 0, y: 0, width: 1440, height: 1100 }
    });

    console.log('✅ Visual verification complete and all screenshots saved successfully!');
  } finally {
    await browser.close();
  }
}

verify().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});

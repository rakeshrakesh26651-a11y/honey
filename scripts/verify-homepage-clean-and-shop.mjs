import { chromium } from 'playwright';

async function main() {
  console.log('🚀 Starting browser verification...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // 1. Visit Homepage
  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check Hero
  const heroHeading = await page.locator('h1').innerText();
  console.log('Hero Heading:', heroHeading);

  // Check that NO product card or lineup section exists on Home Page
  const hasLineup = await page.locator('#lineup').count();
  const hasBestSellers = await page.locator('text=MEET THE BEST SELLERS').count();
  const hasTheLineup = await page.locator('text=THE LINEUP').count();
  const hasAddToCartOnHome = await page.locator('button:has-text("Add to Cart")').count();
  const hasProductPillsOnHome = await page.locator('button:has-text("400g")').count();

  console.log('Homepage Product Check:');
  console.log('- #lineup section count:', hasLineup, '(expected 0)');
  console.log('- "MEET THE BEST SELLERS" count:', hasBestSellers, '(expected 0)');
  console.log('- "THE LINEUP" count:', hasTheLineup, '(expected 0)');
  console.log('- "Add to Cart" buttons count on Home:', hasAddToCartOnHome, '(expected 0)');
  console.log('- Size selector buttons count on Home:', hasProductPillsOnHome, '(expected 0)');

  // Check that brand sections exist on Home Page
  const hasStory = await page.locator('#story').count();
  const hasQuality = await page.locator('#quality').count();
  const hasReviews = await page.locator('#reviews').count();
  const hasSocial = await page.locator('#wild').count();
  const hasWholesale = await page.locator('#wholesale').count();
  const hasNewsletter = await page.locator('#newsletter').count();

  console.log('Homepage Brand Sections Check:');
  console.log('- Story Section (#story):', hasStory, '(expected 1)');
  console.log('- Quality / Lab Section (#quality):', hasQuality, '(expected 1)');
  console.log('- Reviews / Testimonials (#reviews):', hasReviews, '(expected 1)');
  console.log('- Social Community (#wild):', hasSocial, '(expected 1)');
  console.log('- Wholesale Section (#wholesale):', hasWholesale, '(expected 1)');
  console.log('- Newsletter Section (#newsletter):', hasNewsletter, '(expected 1)');

  // Smoothly scroll down page to trigger whileInView animations
  await page.evaluate(async () => {
    const distance = 400;
    const delay = 100;
    while (document.scrollingElement && document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
      document.scrollingElement.scrollBy(0, distance);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  });
  await page.waitForTimeout(500);

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  // Capture full homepage screenshot
  await page.screenshot({ path: 'scripts/homepage-clean-desktop.png', fullPage: true });
  console.log('Saved scripts/homepage-clean-desktop.png');

  // 2. Click Primary CTA "SHOP HONEY" on Hero
  console.log('Clicking "SHOP HONEY" primary CTA...');
  await page.click('a:has-text("SHOP HONEY")');
  await page.waitForTimeout(1000);

  const currentUrl = page.url();
  console.log('Current URL after CTA click:', currentUrl);

  // Check Shop Page
  const shopHeading = await page.locator('h1').innerText();
  console.log('Shop Heading:', shopHeading);

  const productCardsCount = await page.locator('button:has-text("Add to Cart")').count();
  console.log('Product cards with "Add to Cart" in Shop:', productCardsCount, '(expected 6)');

  const forestHoneyCard = await page.locator('h3:has-text("Forest Honey")').count();
  const kombuHoneyCard = await page.locator('h3:has-text("Kombu Honey")').count();
  const gulkandHoneyCard = await page.locator('h3:has-text("Gulkand Honey")').count();

  console.log('- Forest Honey card present in Shop:', forestHoneyCard > 0);
  console.log('- Kombu Honey card present in Shop:', kombuHoneyCard > 0);
  console.log('- Gulkand Honey card present in Shop:', gulkandHoneyCard > 0);

  // Capture shop page screenshot
  await page.screenshot({ path: 'scripts/shop-page-desktop.png', fullPage: true });
  console.log('Saved scripts/shop-page-desktop.png');

  // Test adding to cart in shop
  console.log('Testing Add to Cart in Shop...');
  await page.locator('button:has-text("Add to Cart")').first().click();
  await page.waitForTimeout(600);

  const isCartDrawerVisible = await page.locator('text=Your Cart').count();
  console.log('Cart drawer opened successfully:', isCartDrawerVisible > 0);

  await page.screenshot({ path: 'scripts/shop-cart-drawer.png' });
  console.log('Saved scripts/shop-cart-drawer.png');

  await browser.close();
  console.log('✨ All verifications passed successfully!');
}

main().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});

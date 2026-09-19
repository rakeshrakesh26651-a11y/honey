import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Smooth scroll down to trigger animations
  await page.evaluate(async () => {
    const distance = 300;
    const delay = 80;
    while (document.scrollingElement && document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
      document.scrollingElement.scrollBy(0, distance);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  });
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  await page.screenshot({ path: 'scripts/homepage-clean-mobile.png', fullPage: true });
  console.log('Saved scripts/homepage-clean-mobile.png');

  await browser.close();
}

main().catch(console.error);

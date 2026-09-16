import { chromium } from 'playwright';

async function inspectToEnd() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 800 } });

  try {
    await page.goto('https://olio-store.framer.website/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    console.log('Max scroll at 800px height:', maxScroll);

    for (let s = maxScroll - 600; s <= maxScroll; s += 50) {
      await page.evaluate((y) => window.scrollTo(0, y), s);
      await page.waitForTimeout(50);
      const res = await page.evaluate(() => {
        const wordmark = document.querySelector('[data-framer-name="Big Wordmark"]');
        return {
          scrollY: window.scrollY,
          transform: window.getComputedStyle(wordmark).transform,
          opacity: window.getComputedStyle(wordmark).opacity,
          rect: wordmark.getBoundingClientRect(),
        };
      });
      console.log(`Scroll ${s}:`, res);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
}

inspectToEnd();

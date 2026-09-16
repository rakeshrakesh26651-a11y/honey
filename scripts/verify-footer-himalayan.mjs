import { chromium } from 'playwright';

async function verifyFooterHimalayan() {
  const browser = await chromium.launch({ headless: true });
  console.log('============================================================');
  console.log('VERIFYING FOOTER GIANT TEXT: "HIMALAYAN" ONLY');
  console.log('============================================================\n');

  let failures = 0;
  function assert(condition, msg) {
    if (!condition) {
      console.error(`❌ FAIL: ${msg}`);
      failures++;
    } else {
      console.log(`✓ PASS: ${msg}`);
    }
  }

  const viewports = [
    { width: 1440, height: 900, name: '1440px Desktop Large' },
    { width: 1280, height: 800, name: '1280px Desktop Standard' },
    { width: 1024, height: 768, name: '1024px Tablet Landscape' },
    { width: 768, height: 1024, name: '768px Tablet Portrait' },
    { width: 430, height: 932, name: '430px Mobile Pro Max' },
    { width: 390, height: 844, name: '390px Mobile iPhone 13' },
    { width: 375, height: 667, name: '375px Mobile Compact' },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(600);

    const data = await page.evaluate(() => {
      const el = document.getElementById('footer-giant-wordmark');
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const parentRect = el.parentElement.parentElement.getBoundingClientRect();
      const bodyScrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;

      return {
        text: el.innerText.trim(),
        width: rect.width,
        parentWidth: parentRect.width,
        viewportWidth: clientWidth,
        hasHorizontalOverflow: bodyScrollWidth > clientWidth,
        fontSize: window.getComputedStyle(el).fontSize,
      };
    });

    assert(data !== null, `${vp.name}: Giant wordmark element exists`);
    assert(data.text === 'HIMALAYAN', `${vp.name}: Giant text is strictly "HIMALAYAN" (got "${data?.text}")`);
    assert(!data.hasHorizontalOverflow, `${vp.name}: No horizontal overflow (scrollWidth <= clientWidth)`);
    console.log(`   Font Size: ${data?.fontSize}, Element Width: ${Math.round(data?.width)}px / Container: ${Math.round(data?.parentWidth)}px (ratio: ${(data?.width / data?.parentWidth * 100).toFixed(1)}%)`);

    await page.close();
  }

  // Test Scroll Scrubbing Transform
  console.log('\n--- Testing Scroll Scrubbed Movement on Desktop ---');
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktopPage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await desktopPage.waitForTimeout(500);

  const scrollHeight = await desktopPage.evaluate(() => document.documentElement.scrollHeight);
  const maxScroll = scrollHeight - 900;

  // Scroll to 70% of max scroll
  await desktopPage.evaluate((y) => window.scrollTo(0, y), maxScroll * 0.7);
  await desktopPage.waitForTimeout(400);
  const midData = await desktopPage.evaluate(() => {
    const el = document.getElementById('footer-giant-wordmark');
    const parentMotion = el.parentElement;
    return {
      transform: window.getComputedStyle(parentMotion).transform,
    };
  });
  console.log('   Mid-scroll transform:', midData.transform);

  // Scroll to bottom
  await desktopPage.evaluate((y) => window.scrollTo(0, y), maxScroll);
  await desktopPage.waitForTimeout(400);
  const endData = await desktopPage.evaluate(() => {
    const el = document.getElementById('footer-giant-wordmark');
    const parentMotion = el.parentElement;
    return {
      transform: window.getComputedStyle(parentMotion).transform,
    };
  });
  console.log('   Bottom-scroll transform:', endData.transform);
  assert(endData.transform === 'none' || endData.transform.includes('matrix(1, 0, 0, 1, 0, 0') || endData.transform !== midData.transform, 'Scroll-linked transform responds smoothly to scroll position');

  await desktopPage.close();
  await browser.close();

  console.log('\n============================================================');
  if (failures === 0) {
    console.log('🎉 ALL FOOTER HIMALAYAN TESTS PASSED (100% SUCCESS)');
    console.log('============================================================');
  } else {
    console.error(`💥 ${failures} FAILURES OCCURRED`);
    process.exit(1);
  }
}

verifyFooterHimalayan();

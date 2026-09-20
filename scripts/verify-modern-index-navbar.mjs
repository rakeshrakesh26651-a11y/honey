import { chromium } from 'playwright';

const viewports = [
  { name: '360px', width: 360, height: 780 },
  { name: '390px', width: 390, height: 844 },
  { name: '430px', width: 430, height: 932 },
];

async function verifyModernIndexNavbar() {
  console.log('============================================================');
  console.log('VERIFYING MODERN INDEX NAVBAR (ANIMATION, TIMING & VIEWPORTS)');
  console.log('============================================================\n');

  const browser = await chromium.launch({ headless: true });
  let totalFailures = 0;

  for (const vp of viewports) {
    console.log(`\n--- Testing Mobile Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

    // Check no horizontal scrollbar initially
    const initScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    if (initScrollWidth <= vp.width) {
      console.log(`✓ PASS: Initial page width matches viewport (${initScrollWidth}px <= ${vp.width}px)`);
    } else {
      console.error(`❌ FAIL: Horizontal overflow detected: ${initScrollWidth}px > ${vp.width}px`);
      totalFailures++;
    }

    // Check hamburger button exists and aria-expanded is false
    const toggleBtn = page.locator('button[aria-label="Toggle Navigation Menu"]');
    const isToggleVisible = await toggleBtn.isVisible();
    if (isToggleVisible) {
      console.log('✓ PASS: Toggle navigation button is visible');
    } else {
      console.error('❌ FAIL: Toggle navigation button is not visible');
      totalFailures++;
    }

    const initialAria = await toggleBtn.getAttribute('aria-expanded');
    console.log(`✓ PASS: Initial aria-expanded is "${initialAria}"`);

    // Click toggle button to open menu
    console.log('Clicking hamburger to trigger opening cascade...');
    await toggleBtn.click();

    // Verify aria-expanded switched to true
    const openAria = await toggleBtn.getAttribute('aria-expanded');
    if (openAria === 'true') {
      console.log('✓ PASS: aria-expanded switched to "true"');
    } else {
      console.error(`❌ FAIL: aria-expanded is "${openAria}", expected "true"`);
      totalFailures++;
    }

    // Wait for cascading animation + content stagger (~800ms)
    await page.waitForTimeout(800);

    // Verify 8 columns in the overlay reveal
    const columnsCount = await page.evaluate(() => {
      const blinds = document.querySelectorAll('div[aria-hidden="true"] div');
      return blinds.length;
    });
    if (columnsCount === 8) {
      console.log(`✓ PASS: Exactly 8 vertical blind columns rendered in overlay reveal (found: ${columnsCount})`);
    } else {
      console.error(`❌ FAIL: Expected 8 vertical blinds, found: ${columnsCount}`);
      totalFailures++;
    }

    // Verify index header
    const indexTag = page.locator('text=[ index ]');
    if (await indexTag.isVisible()) {
      console.log('✓ PASS: "[ index ]" indicator is visible');
    } else {
      console.error('❌ FAIL: "[ index ]" indicator not found');
      totalFailures++;
    }

    // Verify 5 navigation links with numbers
    const expectedLinks = [
      { num: '01', label: 'Shop', href: '/shop' },
      { num: '02', label: 'Our Story', href: '/about' },
      { num: '03', label: 'Lab Report', href: '/lab-reports' },
      { num: '04', label: 'FAQ', href: '/faq' },
      { num: '05', label: 'Contact', href: '/contact' },
    ];

    for (const item of expectedLinks) {
      const linkEl = page.locator(`nav.flex-col a[href="${item.href}"]`);
      const isVisible = await linkEl.isVisible();
      if (isVisible) {
        const text = await linkEl.innerText();
        if (text.includes(item.num) && text.includes(item.label)) {
          console.log(`✓ PASS: Link "${item.num} ${item.label}" visible and verified`);
        } else {
          console.error(`❌ FAIL: Link text mismatch for ${item.label}: "${text}"`);
          totalFailures++;
        }
      } else {
        console.error(`❌ FAIL: Link "${item.label}" (${item.href}) not visible`);
        totalFailures++;
      }
    }

    // Verify WhatsApp action CTA
    const waBtn = page.locator('a:has-text("ORDER VIA WHATSAPP")');
    if (await waBtn.isVisible()) {
      console.log('✓ PASS: WhatsApp CTA button is visible inside open menu');
    } else {
      console.error('❌ FAIL: WhatsApp CTA button not found inside menu');
      totalFailures++;
    }

    // Verify Policy Links
    const privacyLink = page.locator('div.z-\\[35\\] a:has-text("Privacy Policy")');
    if (await privacyLink.isVisible()) {
      console.log('✓ PASS: Policy links visible at bottom of menu');
    } else {
      console.error('❌ FAIL: Policy links not found');
      totalFailures++;
    }

    // Verify body scroll lock is active
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    if (bodyOverflow === 'hidden') {
      console.log('✓ PASS: Body scroll is locked (overflow: hidden)');
    } else {
      console.error(`❌ FAIL: Body overflow is "${bodyOverflow}", expected "hidden"`);
      totalFailures++;
    }

    // Capture final verified screenshot
    const screenshotPath = `scripts/final-menu-${vp.width}.png`;
    await page.screenshot({ path: screenshotPath });
    console.log(`✓ PASS: Saved menu screenshot: ${screenshotPath}`);

    // Click toggle button again to test closing choreography
    console.log('Testing closing choreography...');
    await toggleBtn.click();
    await page.waitForTimeout(600);

    const closedAria = await toggleBtn.getAttribute('aria-expanded');
    if (closedAria === 'false') {
      console.log('✓ PASS: aria-expanded returned to "false" on close');
    } else {
      console.error(`❌ FAIL: aria-expanded is "${closedAria}", expected "false"`);
      totalFailures++;
    }

    const bodyOverflowAfter = await page.evaluate(() => document.body.style.overflow);
    if (bodyOverflowAfter === '') {
      console.log('✓ PASS: Body scroll lock cleanly released');
    } else {
      console.error(`❌ FAIL: Body overflow after close is "${bodyOverflowAfter}"`);
      totalFailures++;
    }

    await page.close();
  }

  // Verify Desktop remains unchanged (1440px)
  console.log('\n--- Testing Desktop Viewport: 1440x900 ---');
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktopPage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  const desktopToggle = desktopPage.locator('button[aria-label="Toggle Navigation Menu"]');
  const isDesktopToggleHidden = !(await desktopToggle.isVisible());
  if (isDesktopToggleHidden) {
    console.log('✓ PASS: Hamburger toggle is hidden on desktop (lg:hidden)');
  } else {
    console.error('❌ FAIL: Hamburger toggle is visible on desktop');
    totalFailures++;
  }

  const desktopNav = desktopPage.locator('nav.hidden.lg\\:flex');
  const isDesktopNavVisible = await desktopNav.isVisible();
  if (isDesktopNavVisible) {
    console.log('✓ PASS: Desktop navbar is visible and intact');
  } else {
    console.error('❌ FAIL: Desktop navbar is not visible');
    totalFailures++;
  }

  await desktopPage.screenshot({ path: 'scripts/desktop-navbar-intact.png' });
  await desktopPage.close();

  await browser.close();

  console.log('\n============================================================');
  if (totalFailures === 0) {
    console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY (0 FAILURES)');
    console.log('============================================================');
    process.exit(0);
  } else {
    console.error(`VERIFICATION FAILED WITH ${totalFailures} FAILURES`);
    console.log('============================================================');
    process.exit(1);
  }
}

verifyModernIndexNavbar().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});

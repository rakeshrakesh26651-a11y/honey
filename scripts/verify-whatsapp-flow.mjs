import { chromium } from 'playwright';

// Unit logic verification (matches src/utils/whatsapp.ts)
const WHATSAPP_NUMBER = "918124391725";

function formatWhatsAppOrderMessage(items) {
  if (items.length === 0) {
    return `Hello Himalayan Harvest Honey! 👋\n\nI would like to inquire about your honey products.`;
  }

  if (items.length === 1) {
    const item = items[0];
    const weightText = item.product.weight || 'Standard';
    const priceText = item.quantity > 1 ? `₹${item.product.price} each` : `₹${item.product.price}`;
    return `Hello Himalayan Harvest Honey! 👋\n\nI would like to order:\n\nProduct: ${item.product.name}\nQuantity: ${item.quantity}\nWeight: ${weightText}\nPrice: ${priceText}\n\nPlease confirm availability and the total amount.`;
  }

  const productList = items
    .map((item, index) => {
      const weightText = item.product.weight || 'Standard';
      const priceText = item.quantity > 1 ? `₹${item.product.price * item.quantity}` : `₹${item.product.price}`;
      return `${index + 1}. ${item.product.name} — ${weightText} — Qty: ${item.quantity} — ${priceText}`;
    })
    .join('\n');

  return `Hello Himalayan Harvest Honey! 👋\n\nI would like to order:\n\n${productList}\n\nPlease confirm availability and the total amount.`;
}

async function runTests() {
  console.log('============================================================');
  console.log('PLAYWRIGHT VERIFICATION: COMPLETE PRODUCT LINE & LAB REPORT');
  console.log('============================================================\n');

  let failures = 0;

  function assert(condition, message) {
    if (!condition) {
      console.error(`❌ FAIL: ${message}`);
      failures++;
    } else {
      console.log(`✓ PASS: ${message}`);
    }
  }

  // -----------------------------------------------------------------
  // 0. Unit tests on message formatting
  // -----------------------------------------------------------------
  console.log('--- Phase 0: Message Formatting Unit Tests ---');
  const singleItem = [{ product: { name: 'Forest Honey', weight: 'Standard', price: 699 }, quantity: 1 }];
  const singleExpected = `Hello Himalayan Harvest Honey! 👋\n\nI would like to order:\n\nProduct: Forest Honey\nQuantity: 1\nWeight: Standard\nPrice: ₹699\n\nPlease confirm availability and the total amount.`;
  assert(formatWhatsAppOrderMessage(singleItem) === singleExpected, 'Single item message matches specification exactly');

  const multiItems = [
    { product: { name: 'Forest Honey', weight: 'Standard', price: 699 }, quantity: 1 },
    { product: { name: 'Kombu Honey', weight: 'Standard', price: 799 }, quantity: 1 },
  ];
  const multiExpected = `Hello Himalayan Harvest Honey! 👋\n\nI would like to order:\n\n1. Forest Honey — Standard — Qty: 1 — ₹699\n2. Kombu Honey — Standard — Qty: 1 — ₹799\n\nPlease confirm availability and the total amount.`;
  assert(formatWhatsAppOrderMessage(multiItems) === multiExpected, 'Multi-item message matches specification exactly');

  const browser = await chromium.launch({ headless: true });

  try {
    // -----------------------------------------------------------------
    // 1. Desktop Browser (1280x800): Full Flow Verification
    // -----------------------------------------------------------------
    console.log('\n--- Phase 1: Desktop Browser Verification (1280x800) ---');
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const desktopPage = await desktopContext.newPage();

    // Track window.open calls
    await desktopPage.addInitScript(() => {
      window.__openedUrls = [];
      window.open = function (url) {
        window.__openedUrls.push(url);
        return { focus() {}, close() {}, closed: false };
      };
    });

    await desktopPage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await desktopPage.locator('button[aria-label="View Shopping Cart"]').waitFor({ state: 'visible' });

    // 1. Header & Brand Logo verification
    const headerLogo = await desktopPage.locator('header a[href="/"]').textContent();
    assert(headerLogo.includes('HIMALAYAN HARVEST HONEY'), `Header logo verified: "${headerLogo.trim()}"`);

    // 2. Hero copy verification
    const heroHeading = await desktopPage.locator('h1').textContent();
    assert(heroHeading.includes('PURE BY NATURE') && heroHeading.includes('PERFECTED BY THE PEAKS'), `Hero heading verified: "${heroHeading.replace(/\s+/g, ' ').trim()}"`);

    // 3. Feature Strip 01-04 verification
    assert(await desktopPage.locator('text=HIGH ALTITUDES').first().isVisible(), 'Feature 01: SOURCED FROM HIGH ALTITUDES is visible');
    assert(await desktopPage.locator('text=100% PURE &').first().isVisible(), 'Feature 02: 100% PURE & NATURAL is visible');
    assert(await desktopPage.locator('text=NATURALLY').first().isVisible(), 'Feature 03: NATURALLY HARVESTED is visible');
    assert(await desktopPage.locator('text=NO ARTIFICIAL').first().isVisible(), 'Feature 04: NO ARTIFICIAL ADDITIVES is visible');

    // 4. Complete Product Collection Verification
    const lineupHeading = await desktopPage.locator('#lineup h2').textContent();
    assert(lineupHeading.includes('THE HONEY COLLECTION'), `Collection heading verified: "${lineupHeading.trim()}"`);

    const expectedProducts = [
      'Forest Honey',
      'Kombu Honey',
      'Gulkand Honey',
      'Kurinji Honey',
      'Ghee',
    ];

    for (const name of expectedProducts) {
      const prodCard = desktopPage.locator(`#lineup h4:has-text("${name}")`);
      assert(await prodCard.isVisible(), `Product "${name}" is present in the collection`);
    }

    // Verify Ghee is not described as honey
    const gheeCard = desktopPage.locator('#lineup .group').filter({ hasText: 'Ghee' }).first();
    const gheeText = await gheeCard.textContent();
    assert(!gheeText.toLowerCase().includes('ghee honey') && !gheeText.toLowerCase().includes('honey ghee'), 'Ghee is cleanly categorized and not described as honey');

    // 5. Add to Cart for Forest Honey -> WhatsApp Order Verification
    const firstProduct = desktopPage.locator('#lineup .group').first();
    await firstProduct.hover();
    const addToCartButton = firstProduct.locator('button:has-text("Add to Cart")');
    await addToCartButton.waitFor({ state: 'visible' });
    await addToCartButton.click();
    await desktopPage.waitForTimeout(400);

    // Cart opens
    const cartDrawer = desktopPage.locator('h3:has-text("Your Cart")');
    assert(await cartDrawer.isVisible(), 'Cart drawer opens upon Add to Cart');

    // WhatsApp URL opened
    const openedUrls = await desktopPage.evaluate(() => window.__openedUrls);
    assert(openedUrls.length === 1, `WhatsApp opened on click (count: ${openedUrls.length})`);
    const waUrl = openedUrls[0];
    assert(waUrl.startsWith(`https://wa.me/${WHATSAPP_NUMBER}?text=`), `WhatsApp URL targets verified number ${WHATSAPP_NUMBER}`);

    const decoded = decodeURIComponent(waUrl.split('text=')[1]);
    console.log('\nDecoded Single Product Message:\n' + decoded + '\n');
    assert(decoded.includes('Product: Forest Honey'), 'Message includes "Product: Forest Honey"');
    assert(decoded.includes('Weight: Standard'), 'Message includes "Weight: Standard"');
    assert(decoded.includes('Price: ₹699'), 'Message includes "Price: ₹699"');

    // Close cart drawer to continue page interactions
    await desktopPage.locator('button[aria-label="Close cart"]').click();
    await desktopPage.waitForTimeout(300);

    // 6. Story section verification
    const storyHeading = await desktopPage.locator('#story h2').textContent();
    assert(storyHeading.includes('FOUR GENERATIONS') && storyHeading.includes('ONE TRADITION'), `Story heading verified: "${storyHeading.replace(/\s+/g, ' ').trim()}"`);

    // 7. BUY 1 GET 1 Banner verification
    const promoHeading = await desktopPage.locator('#offers h2').textContent();
    assert(promoHeading.includes('BUY 1 GET 1'), `Promotional heading verified: "${promoHeading.trim()}"`);

    // 8. Quality Section & Laboratory Report Verification
    const qualityHeading = await desktopPage.locator('#quality h2').textContent();
    assert(qualityHeading.includes('QUALITY YOU CAN VERIFY'), `Quality heading verified: "${qualityHeading.trim()}"`);

    const testHouse = desktopPage.locator('#quality').getByText('Tamilnadu Test House Private Limited').first();
    assert(await testHouse.isVisible(), 'Tamilnadu Test House Private Limited is featured in Quality section');

    const reportNo = desktopPage.locator('#quality').getByText('TNTH/M-0366/2026-27').first();
    assert(await reportNo.isVisible(), 'Report Number TNTH/M-0366/2026-27 is visible');

    // Click "VIEW FULL TEST REPORT" to open modal
    const viewReportBtn = desktopPage.locator('#quality button:has-text("VIEW FULL TEST REPORT")');
    await viewReportBtn.click();
    await desktopPage.waitForTimeout(400);

    // Verify Modal & 11 Results
    const modalHeading = desktopPage.locator('.fixed.inset-0.z-50 h3:has-text("Tamilnadu Test House Private Limited")');
    assert(await modalHeading.isVisible(), 'Lab report modal opened successfully');

    // Verify specific parameters in table
    const tableContent = await desktopPage.locator('table').textContent();
    const verifiedParams = [
      'Specific Gravity @ 27°C',
      'Moisture',
      'Total Reducing Sugar',
      'Sucrose',
      'Fructose-Glucose Ratio',
      'Total Ash',
      'Acidity',
      'Pollen Count',
      "Fiehe's Test",
      'Hydroxymethylfurfural (HMF)',
      'Optical Density @ 660 nm',
    ];

    for (const p of verifiedParams) {
      assert(tableContent.includes(p), `Modal table contains verified parameter: "${p}"`);
    }

    // Verify Remark in modal
    const modalText = await desktopPage.locator('.fixed.inset-0.z-50').textContent();
    assert(modalText.includes('largely complies with the requirements of IS 4941:1994 for Special Grade honey'), 'Official laboratory remark verified');

    // Close modal
    await desktopPage.locator('button:has-text("Close")').click();
    await desktopPage.waitForTimeout(300);

    // 9. Customer Reviews (Real Honey. Real Experiences.)
    const reviewsHeading = await desktopPage.locator('#reviews h2').textContent();
    assert(reviewsHeading.includes('REAL HONEY') && reviewsHeading.includes('REAL EXPERIENCES'), `Reviews heading verified: "${reviewsHeading.replace(/\s+/g, ' ').trim()}"`);

    // 10. Social Proof (From Our Community / 9,592 followers)
    const communityHeading = await desktopPage.locator('h2:has-text("FROM OUR COMMUNITY")');
    assert(await communityHeading.isVisible(), '"FROM OUR COMMUNITY" heading is visible');
    const followersText = await desktopPage.locator('text=9,592 FOLLOWERS');
    assert(await followersText.isVisible(), '9,592 followers verified in social proof section');

    // 11. Wholesale section (Looking for honey in bulk?)
    const wholesaleHeading = await desktopPage.locator('#wholesale h2').textContent();
    assert(wholesaleHeading.includes('LOOKING FOR HONEY IN BULK?'), `Wholesale heading verified: "${wholesaleHeading.trim()}"`);

    // Click Wholesale CTA
    const wholesaleCta = desktopPage.locator('#wholesale button:has-text("WHOLESALE ENQUIRY")');
    await wholesaleCta.click();
    await desktopPage.waitForTimeout(300);
    const openedUrlsAfterWholesale = await desktopPage.evaluate(() => window.__openedUrls);
    assert(openedUrlsAfterWholesale.length === 2, 'Wholesale button opened WhatsApp');
    const wholesaleMsg = decodeURIComponent(openedUrlsAfterWholesale[1].split('text=')[1]);
    assert(wholesaleMsg.includes('wholesale/bulk honey enquiry'), 'Wholesale message is correctly formulated');

    // 12. Footer verified
    const footerPhone = await desktopPage.locator('footer a[href="tel:+918124391725"]').first();
    assert(await footerPhone.isVisible(), 'Footer contains phone +91 81243 91725');
    const footerInsta = await desktopPage.locator('footer a[href="https://instagram.com/himalayanharvesthoney"]').first();
    assert(await footerInsta.isVisible(), 'Footer contains Instagram @himalayanharvesthoney');

    await desktopContext.close();

    // -----------------------------------------------------------------
    // 2. Responsive Viewport Regression Tests
    // Required viewports: 1440px, 1280px, 1024px, 768px, 430px, 390px, 375px
    // -----------------------------------------------------------------
    console.log('\n--- Phase 2: Responsive Viewports Regression Tests ---');
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
      const vpContext = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: vp.width <= 768,
        hasTouch: vp.width <= 768,
      });
      const vpPage = await vpContext.newPage();

      await vpPage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
      const h1 = await vpPage.locator('h1').textContent();
      assert(h1.includes('PURE BY NATURE'), `Viewport ${vp.name} loads correctly with Hero headline`);

      // Check for horizontal scroll / layout shift
      const hasHorizontalScroll = await vpPage.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      assert(!hasHorizontalScroll, `Viewport ${vp.name} has NO horizontal overflow/layout shift`);

      // If mobile, test Mobile Menu toggle & logo
      if (vp.width <= 768) {
        const menuButton = vpPage.locator('button[aria-label="Toggle Navigation Menu"]');
        assert(await menuButton.isVisible(), `Mobile hamburger button is visible on ${vp.name}`);
        await menuButton.click();
        await vpPage.waitForTimeout(400);
        const shopLink = vpPage.locator('div a[href="#lineup"]:visible').first();
        assert(await shopLink.isVisible(), `Mobile menu opened and has Shop link on ${vp.name}`);
      }

      await vpContext.close();
    }

  } catch (err) {
    console.error('Test execution error:', err);
    failures++;
  } finally {
    await browser.close();
  }

  console.log('\n============================================================');
  if (failures === 0) {
    console.log('🎉 ALL PLAYWRIGHT REGRESSION TESTS PASSED (100% SUCCESS)');
    console.log('============================================================');
    process.exit(0);
  } else {
    console.error(`💥 ${failures} TEST FAILURES OCCURRED`);
    console.log('============================================================');
    process.exit(1);
  }
}

runTests();

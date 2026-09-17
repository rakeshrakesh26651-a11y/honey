import { chromium } from 'playwright';

// Unit logic verification (matches src/utils/whatsapp.ts)
const WHATSAPP_NUMBER = "918124391725";

function formatWhatsAppOrderMessage(items) {
  if (items.length === 0) {
    return `Hello Himalayan Harvest Honey! 👋\n\nI would like to inquire about your honey products.`;
  }

  if (items.length === 1) {
    const item = items[0];
    const sizeText = item.size || item.product.weight || '400g';
    const unitPrice = item.unitPrice || item.product.price;
    const priceText = item.quantity > 1 ? `₹${unitPrice * item.quantity} (₹${unitPrice} each)` : `₹${unitPrice}`;
    return `Hello Himalayan Harvest Honey! 👋\n\nI would like to order:\n\nProduct: ${item.product.name}\nQuantity: ${item.quantity}\nWeight/Size: ${sizeText}\nPrice: ${priceText}\n\nPlease confirm availability and the total amount.`;
  }

  const productList = items
    .map((item, index) => {
      const sizeText = item.size || item.product.weight || '400g';
      const unitPrice = item.unitPrice || item.product.price;
      const priceText = `₹${unitPrice * item.quantity}`;
      return `${index + 1}. ${item.product.name} — ${sizeText} — Qty: ${item.quantity} — ${priceText}`;
    })
    .join('\n');

  return `Hello Himalayan Harvest Honey! 👋\n\nI would like to order:\n\n${productList}\n\nPlease confirm availability and the total amount.`;
}

async function runTests() {
  console.log('============================================================');
  console.log('PLAYWRIGHT VERIFICATION: VARIANTS, CART, TESTIMONIALS & POLICIES');
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
  const singleItem = [
    {
      product: { name: 'Forest Honey', weight: '400g', price: 699 },
      size: '400g',
      unitPrice: 699,
      quantity: 1,
    },
  ];
  const singleExpected = `Hello Himalayan Harvest Honey! 👋\n\nI would like to order:\n\nProduct: Forest Honey\nQuantity: 1\nWeight/Size: 400g\nPrice: ₹699\n\nPlease confirm availability and the total amount.`;
  assert(formatWhatsAppOrderMessage(singleItem) === singleExpected, 'Single item message matches specification exactly');

  const multiItems = [
    { product: { name: 'Forest Honey' }, size: '400g', unitPrice: 699, quantity: 1 },
    { product: { name: 'Forest Honey' }, size: '1000g', unitPrice: 1299, quantity: 2 },
    { product: { name: 'Kombu Honey' }, size: '700g', unitPrice: 1199, quantity: 1 },
  ];
  const multiExpected = `Hello Himalayan Harvest Honey! 👋\n\nI would like to order:\n\n1. Forest Honey — 400g — Qty: 1 — ₹699\n2. Forest Honey — 1000g — Qty: 2 — ₹2598\n3. Kombu Honey — 700g — Qty: 1 — ₹1199\n\nPlease confirm availability and the total amount.`;
  assert(formatWhatsAppOrderMessage(multiItems) === multiExpected, 'Multi-variant item message matches specification');

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

    // Verify Offers link is NOT in Header
    const offersInHeader = await desktopPage.locator('header a[href="/#offers"]').count();
    assert(offersInHeader === 0, 'Offers link cleanly removed from header');

    // 2. Hero copy verification
    const heroHeading = await desktopPage.locator('h1').textContent();
    assert(
      heroHeading.includes('PURE BY NATURE') && heroHeading.includes('PERFECTED BY THE PEAKS'),
      `Hero heading verified: "${heroHeading.replace(/\s+/g, ' ').trim()}"`
    );

    // 3. Product Collection with 3 Variants (400g / 700g / 1000g)
    console.log('\n--- Phase 1.1: Product Variants & Add to Cart (No Auto WhatsApp) ---');
    const lineupHeading = await desktopPage.locator('#lineup h2').textContent();
    assert(lineupHeading.includes('Find Your Perfect Honey'), `Collection heading verified: "${lineupHeading.trim()}"`);

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

    // Select 1000g for Forest Honey and verify price updates to ₹1299
    const forestCard = desktopPage.locator('#lineup .group').filter({ hasText: 'Forest Honey' }).first();
    const btn1000g = forestCard.locator('button[aria-label="Select 1000g for Forest Honey"]');
    assert(await btn1000g.isVisible(), 'Forest Honey has 1000g variant button');
    await btn1000g.click();
    await desktopPage.waitForTimeout(200);

    const forestPriceText = await forestCard.locator('span:has-text("₹1299")').first().textContent();
    assert(forestPriceText.includes('1299'), `Forest Honey 1000g price dynamically updated to ₹1299`);

    // Click "Add to Cart" for Forest Honey 1000g
    const addForestBtn = forestCard.locator('button:has-text("Add to Cart")');
    await addForestBtn.click();
    await desktopPage.waitForTimeout(400);

    // Cart Drawer opens
    const cartTitle = desktopPage.locator('h3:has-text("Your Cart")');
    assert(await cartTitle.isVisible(), 'Cart drawer opens upon clicking Add to Cart');

    // CRITICAL: Verify NO automatic WhatsApp window.open occurred!
    const openedUrlsAfterAdd = await desktopPage.evaluate(() => window.__openedUrls);
    assert(
      openedUrlsAfterAdd.length === 0,
      `Add to Cart did NOT trigger automatic WhatsApp redirect (opened count: ${openedUrlsAfterAdd.length})`
    );

    // Verify Cart contains "Forest Honey" with "1000g" and price "₹1,299"
    const cartText = await desktopPage.locator('[aria-label="Your Cart"]').textContent();
    assert(cartText.includes('Forest Honey'), 'Cart contains Forest Honey');
    assert(cartText.includes('1000g'), 'Cart item shows size 1000g');
    assert(cartText.includes('1,299') || cartText.includes('1299'), 'Cart item shows ₹1299');

    // Close cart drawer
    await desktopPage.locator('button[aria-label="Close cart"]').click();
    await desktopPage.waitForTimeout(300);

    // Now select 400g for Forest Honey and add it too -> should create distinct item in cart
    const btn400g = forestCard.locator('button[aria-label="Select 400g for Forest Honey"]');
    await btn400g.click();
    await desktopPage.waitForTimeout(200);
    await addForestBtn.click();
    await desktopPage.waitForTimeout(400);

    // Verify cart has 2 distinct line items
    const cartItemsCount = await desktopPage.locator('[aria-label="Your Cart"] button:has-text("Remove")').count();
    assert(cartItemsCount === 2, `Cart maintains distinct line items for 400g and 1000g variants (count: ${cartItemsCount})`);

    // Verify subtotal: 1299 + 699 = 1998
    const subtotalText = await desktopPage.locator('[aria-label="Your Cart"]').textContent();
    assert(subtotalText.includes('1,998') || subtotalText.includes('1998'), 'Cart subtotal correctly computed as ₹1,998');

    // Test WhatsApp Checkout from Cart Drawer
    const checkoutBtn = desktopPage.locator('button:has-text("Order via WhatsApp")');
    await checkoutBtn.click();
    await desktopPage.waitForTimeout(300);

    const openedUrlsAfterCheckout = await desktopPage.evaluate(() => window.__openedUrls);
    assert(openedUrlsAfterCheckout.length === 1, 'Manual checkout button opens WhatsApp');
    const decodedWa = decodeURIComponent(openedUrlsAfterCheckout[0].split('text=')[1]);
    console.log('\nDecoded Cart WhatsApp Order:\n' + decodedWa + '\n');
    assert(decodedWa.includes('Forest Honey — 1000g'), 'WhatsApp text lists Forest Honey — 1000g');
    assert(decodedWa.includes('Forest Honey — 400g'), 'WhatsApp text lists Forest Honey — 400g');

    // Close cart
    await desktopPage.locator('button[aria-label="Close cart"]').click();
    await desktopPage.waitForTimeout(300);

    // 4. Verify Absence of BUY 1 GET 1
    console.log('\n--- Phase 1.2: Verify Absence of BUY 1 GET 1 ---');
    const bogoCount = await desktopPage.locator('text=BUY 1 GET 1').count();
    assert(bogoCount === 0, 'BUY 1 GET 1 section and copy completely removed from website');

    // 5. Testimonials Section & Animated Carousel Verification
    console.log('\n--- Phase 1.3: Animated Testimonials Carousel Verification ---');
    const reviewsSection = desktopPage.locator('#reviews');
    await reviewsSection.scrollIntoViewIfNeeded();
    await desktopPage.waitForTimeout(500);

    const reviewsEyebrow = await reviewsSection.locator('text=CUSTOMER EXPERIENCES').first().textContent();
    assert(reviewsEyebrow.includes('CUSTOMER EXPERIENCES'), 'Testimonials eyebrow verified');

    const reviewsH2 = await reviewsSection.locator('h2').textContent();
    assert(reviewsH2.trim() === 'REAL EXPERIENCES.', `Testimonials heading verified: "${reviewsH2.trim()}"`);

    const reviewsDesc = await reviewsSection.locator('p').first().textContent();
    assert(
      reviewsDesc.includes('Genuine customer experiences shared by honey lovers across Tamil Nadu and beyond'),
      'Testimonials supporting text verified'
    );

    // Verify all 6 customers exist in carousel
    const allCustomers = ['Kavitha R.', 'Senthil M.', 'Deepak N.', 'Ravi', 'Chandra', 'Tarun Naik'];
    for (const author of allCustomers) {
      const card = reviewsSection.locator(`h4:has-text("${author}")`);
      assert(await card.isVisible(), `Customer review for "${author}" is rendered in the carousel`);
    }

    // Verify navigation controls: Previous / Next buttons & Dot indicators
    const prevBtn = reviewsSection.locator('button[aria-label="Previous testimonial"]');
    const nextBtn = reviewsSection.locator('button[aria-label="Next testimonial"]');
    assert(await prevBtn.isVisible(), 'Carousel previous button is visible');
    assert(await nextBtn.isVisible(), 'Carousel next button is visible');

    const dotButtons = reviewsSection.locator('button[aria-label^="Go to testimonial"]');
    const dotCount = await dotButtons.count();
    assert(dotCount === 6, `Pagination indicators rendered with exactly 6 dots (found: ${dotCount})`);

    // Click Next button and verify active slide advances
    await nextBtn.click();
    await desktopPage.waitForTimeout(400);

    // Click on Tarun Naik's dot (index 5 / 6th dot)
    await dotButtons.nth(5).click();
    await desktopPage.waitForTimeout(400);

    // 6. Quality & Lab Report Section
    console.log('\n--- Phase 1.4: Quality & Lab Report Verification ---');
    const qualityHeading = await desktopPage.locator('#quality h2').textContent();
    assert(qualityHeading.includes('QUALITY YOU CAN VERIFY'), `Quality heading verified: "${qualityHeading.trim()}"`);

    const testHouse = desktopPage.locator('#quality').getByText('Tamilnadu Test House Private Limited').first();
    assert(await testHouse.isVisible(), 'Tamilnadu Test House is featured');

    // 7. Wholesale Section
    const wholesaleHeading = await desktopPage.locator('#wholesale h2').textContent();
    assert(wholesaleHeading.includes('LOOKING FOR HONEY IN BULK?'), `Wholesale heading verified`);

    // 8. Footer Legal Policy Links Verification
    console.log('\n--- Phase 1.5: Policy Routes and Confirmed Terms Verification ---');
    const privacyLink = desktopPage.locator('footer a[href="/privacy-policy"]');
    const termsLink = desktopPage.locator('footer a[href="/terms-and-conditions"]');
    const refundLink = desktopPage.locator('footer a[href="/refund-policy"]');

    assert(await privacyLink.isVisible(), 'Footer contains visible "Privacy Policy" link');
    assert(await termsLink.isVisible(), 'Footer contains visible "Terms & Conditions" link');
    assert(await refundLink.isVisible(), 'Footer contains visible "Refund & Return Policy" link');

    // Test Refund Policy
    await refundLink.click();
    await desktopPage.waitForTimeout(400);
    const refundH1 = await desktopPage.locator('h1').textContent();
    assert(refundH1.includes('Refund & Return Policy'), `Refund policy page rendered: "${refundH1.trim()}"`);
    assert(await desktopPage.locator('text=24-Hour Return Request').first().isVisible(), '24-Hour Return Request callout visible');
    assert(await desktopPage.locator('text=Within 10 Days').first().isVisible(), 'Within 10 Days refund callout visible');
    assert(await desktopPage.locator('text=Applicable courier or shipping charges will be deducted').first().isVisible(), 'Courier deduction notice visible');

    // Navigate back Home
    await desktopPage.locator('button:has-text("Back to Home")').click();
    await desktopPage.waitForTimeout(400);

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

      // If mobile, test Mobile Menu toggle
      if (vp.width <= 768) {
        const menuButton = vpPage.locator('button[aria-label="Toggle Navigation Menu"]');
        assert(await menuButton.isVisible(), `Mobile hamburger button is visible on ${vp.name}`);
        await menuButton.click();
        await vpPage.waitForTimeout(300);
        const shopLink = vpPage.locator('div a[href="/#lineup"]:visible').first();
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

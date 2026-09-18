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
  console.log('PLAYWRIGHT VERIFICATION: BEST SELLERS, VARIANTS, CART & SECTIONS');
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

    // Verify Reviews link is NOT in Header
    const reviewsInHeader = await desktopPage.locator('header a[href="/reviews"]').count();
    assert(reviewsInHeader === 0, 'Reviews link cleanly removed from header navigation');

    // Verify Desktop Header navigation links
    const desktopNavLinks = await desktopPage.locator('header nav a').allTextContents();
    const trimmedNav = desktopNavLinks.map(t => t.trim());
    assert(!trimmedNav.includes('Reviews'), 'Desktop header does NOT include Reviews');
    assert(trimmedNav.includes('Shop'), 'Desktop header includes Shop');
    assert(trimmedNav.includes('Our Story'), 'Desktop header includes Our Story');
    assert(trimmedNav.includes('Lab Report'), 'Desktop header includes Lab Report');
    assert(trimmedNav.includes('FAQ'), 'Desktop header includes FAQ');
    assert(trimmedNav.includes('Contact'), 'Desktop header includes Contact');
    assert(trimmedNav.length === 5, `Desktop header has exactly 5 nav links (found: ${trimmedNav.join(', ')})`);

    // 2. Hero copy & Background Video verification
    const heroHeading = await desktopPage.locator('h1').textContent();
    assert(
      heroHeading.includes('Pure Honey'),
      `Hero heading verified: "${heroHeading.replace(/\s+/g, ' ').trim()}"`
    );
    const heroVideo = desktopPage.locator('section video source[src="/videos/himalayan-honey-hero.mp4"]');
    assert((await heroVideo.count()) > 0, 'Cinematic background video is mounted with /videos/himalayan-honey-hero.mp4');
    const supportingLine = desktopPage.locator('text=From the Himalayas.').first();
    assert(await supportingLine.isVisible(), 'Supporting line "From the Himalayas." is visible');

    // 3. Best Sellers Section on Landing Page (OLIO-Style Minimal Presentation)
    console.log('\n--- Phase 1.1: OLIO-Style Best Sellers Section on Landing Page ---');
    const lineupSection = desktopPage.locator('#lineup');
    assert(await lineupSection.isVisible(), 'Best Sellers section (#lineup) is visible on landing page');

    const lineupHeading = await lineupSection.locator('h2').textContent();
    assert(lineupHeading.includes('MEET THE BEST SELLERS'), `Best Sellers heading verified: "${lineupHeading.trim()}"`);

    // Must show EXACTLY 3 Honey products
    const bestSellerCards = lineupSection.locator('a[href^="/product/"]');
    const cardCount = await bestSellerCards.count();
    assert(cardCount === 3, `Exactly 3 products displayed in Best Sellers (found: ${cardCount})`);

    const expectedBestSellers = ['Forest Honey', 'Kombu Honey', 'Gulkand Honey'];
    for (const name of expectedBestSellers) {
      const card = lineupSection.locator(`h3:has-text("${name}")`);
      assert(await card.isVisible(), `Best seller "${name}" is present`);
    }

    // Verify badges: Each has "Best Seller" badge
    const badgesCount = await lineupSection.locator('[data-testid="bestseller-badge"]').count();
    assert(badgesCount === 3, `All 3 products have "Best Seller" badge (found: ${badgesCount})`);

    // Verify prices are displayed
    assert(await lineupSection.locator('span:has-text("₹699")').count() >= 2, 'Prices rendered for 699 products');
    assert(await lineupSection.locator('span:has-text("₹799")').count() >= 1, 'Price rendered for 799 product');

    // STRICT CHECKS: No Add to Cart, No ML/Grams, No Quantity, No Reviews/Ratings
    const addBtnCount = await lineupSection.locator('button:has-text("Add to Cart")').count();
    assert(addBtnCount === 0, `No "Add to Cart" button in Best Sellers section (found: ${addBtnCount})`);

    const sizeBtnCount = await lineupSection.locator('button:has-text("400g"), button:has-text("700g"), button:has-text("1000g")').count();
    assert(sizeBtnCount === 0, `No size selector buttons in Best Sellers section (found: ${sizeBtnCount})`);

    const ratingCount = await lineupSection.locator('[aria-label*="star"]').count();
    assert(ratingCount === 0, `No star ratings in Best Sellers section (found: ${ratingCount})`);

    // 4. Quality Checklist Removed from Landing Page
    console.log('\n--- Phase 1.2: Verify Quality Checklist & FAQ Removed from Landing Page ---');
    const qualityOnHome = await desktopPage.locator('#quality').count();
    assert(qualityOnHome === 0, 'Quality Checklist section removed from landing page');

    const faqOnHome = await desktopPage.locator('#faq').count();
    assert(faqOnHome === 0, 'FAQ section removed from landing page');

    // 5. From Our Community Preserved
    console.log('\n--- Phase 1.3: Verify "From Our Community" Preserved on Landing Page ---');
    const communitySection = desktopPage.locator('#wild');
    assert(await communitySection.isVisible(), 'From Our Community section is present on landing page');
    const communityHeading = await communitySection.locator('h2').textContent();
    assert(communityHeading.includes('FROM OUR COMMUNITY'), `From Our Community heading verified: "${communityHeading.trim()}"`);

    // 6. Testimonials Section
    console.log('\n--- Phase 1.4: Animated Testimonials Carousel Verification ---');
    const reviewsSection = desktopPage.locator('#reviews');
    await reviewsSection.scrollIntoViewIfNeeded();
    await desktopPage.waitForTimeout(400);

    const reviewsH2 = await reviewsSection.locator('h2').textContent();
    assert(
      reviewsH2.includes('WHAT OUR CUSTOMERS') || reviewsH2.includes('REAL PEOPLE. REAL RESULTS.') || reviewsH2.includes('REAL EXPERIENCES.'),
      `Testimonials heading verified: "${reviewsH2.trim()}"`
    );

    const allCustomers = [
      { name: 'Kavitha R.', img: '/images/reviews/kavitha-r.jpg' },
      { name: 'Senthil M.', img: '/images/reviews/senthil-m.jpg' },
      { name: 'Deepak N.', img: '/images/reviews/deepak-n.jpg' },
      { name: 'Ravi', img: '/images/reviews/ravi.jpg' },
      { name: 'Chandra', img: '/images/reviews/chandra.jpg' },
      { name: 'Tarun Naik', img: '/images/reviews/tarun-naik.jpg' },
    ];

    for (const c of allCustomers) {
      const card = reviewsSection.locator(`h4:has-text("${c.name}")`).first();
      assert(await card.isVisible(), `Customer review for "${c.name}" is rendered in the carousel`);
      const img = reviewsSection.locator(`img[src="${c.img}"]`);
      assert(await img.count() >= 1, `Portrait image "${c.img}" is present for ${c.name}`);
    }

    // Verify Carousel Arrows and Dots
    const prevBtn = reviewsSection.locator('button[aria-label="Previous testimonial"]');
    const nextBtn = reviewsSection.locator('button[aria-label="Next testimonial"]');
    assert(await prevBtn.isVisible(), 'Carousel previous button is visible');
    assert(await nextBtn.isVisible(), 'Carousel next button is visible');

    // Test clicking Next button
    await nextBtn.click();
    await desktopPage.waitForTimeout(400);
    const activeImgAfterNext = reviewsSection.locator('img[src="/images/reviews/senthil-m.jpg"]').first();
    assert(await activeImgAfterNext.isVisible(), 'Active portrait transitioned to Senthil M. on Next button click');

    // Test keyboard navigation (ArrowLeft)
    await desktopPage.keyboard.press('ArrowLeft');
    await desktopPage.waitForTimeout(400);
    const activeImgAfterKey = reviewsSection.locator('img[src="/images/reviews/kavitha-r.jpg"]').first();
    assert(await activeImgAfterKey.isVisible(), 'Active portrait transitioned back to Kavitha R. on ArrowLeft keypress');

    // 7. Test Dedicated Shop Page with Variants & Add to Cart
    console.log('\n--- Phase 1.5: Dedicated Shop Page Variants & Cart Interaction ---');
    await desktopPage.goto('http://localhost:3000/shop', { waitUntil: 'domcontentloaded' });
    await desktopPage.waitForTimeout(500);

    const shopHeading = await desktopPage.locator('h1').textContent();
    assert(shopHeading.includes('OUR HONEY COLLECTION'), `Shop page loaded: "${shopHeading.trim()}"`);

    // Select 1000g for Forest Honey and verify price updates to ₹1299
    const forestCard = desktopPage.locator('.group').filter({ hasText: 'Forest Honey' }).first();
    const btn1000g = forestCard.locator('button[aria-label="Select 1000g for Forest Honey"]');
    assert(await btn1000g.isVisible(), 'Forest Honey on /shop has 1000g variant button');
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
    assert(decodedWa.includes('Forest Honey — 1000g'), 'WhatsApp text lists Forest Honey — 1000g');
    assert(decodedWa.includes('Forest Honey — 400g'), 'WhatsApp text lists Forest Honey — 400g');

    // Close cart
    await desktopPage.locator('button[aria-label="Close cart"]').click();
    await desktopPage.waitForTimeout(300);

    // 8. Quality & Lab Reports Dedicated Page
    console.log('\n--- Phase 1.6: Dedicated Quality & Lab Reports Page Verification ---');
    await desktopPage.goto('http://localhost:3000/lab-reports', { waitUntil: 'domcontentloaded' });
    const labH1 = await desktopPage.locator('h1').textContent();
    assert(labH1.includes('LAB REPORTS'), `Dedicated Lab Reports page renders: "${labH1.trim()}"`);
    const labTestHouse = desktopPage.getByText('Tamilnadu Test House Private Limited').first();
    assert(await labTestHouse.isVisible(), 'Tamilnadu Test House report is present on dedicated /lab-reports');

    // 9. FAQ Dedicated Page
    console.log('\n--- Phase 1.7: Dedicated FAQ Page Verification ---');
    await desktopPage.goto('http://localhost:3000/faq', { waitUntil: 'domcontentloaded' });
    const faqHeading = await desktopPage.locator('#faq h2').textContent();
    assert(faqHeading.includes('FREQUENTLY ASKED QUESTIONS'), `Dedicated FAQ page renders: "${faqHeading.trim()}"`);
    const faqItems = await desktopPage.locator('button[aria-expanded]').count();
    assert(faqItems >= 8, `Dedicated FAQ page renders all FAQ accordion items (found: ${faqItems})`);

    // 10. Footer Policies
    console.log('\n--- Phase 1.8: Policy Routes Verification ---');
    await desktopPage.goto('http://localhost:3000/refund-policy', { waitUntil: 'domcontentloaded' });
    const refundH1 = await desktopPage.locator('h1').textContent();
    assert(refundH1.includes('Refund & Return Policy'), `Refund policy page rendered: "${refundH1.trim()}"`);

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
      assert(h1.includes('Pure Honey'), `Viewport ${vp.name} loads correctly with Hero headline`);

      // Best Sellers section checks on this viewport
      const vpCards = await vpPage.locator('#lineup a[href^="/product/"]').count();
      assert(vpCards === 3, `Viewport ${vp.name} has exactly 3 Best Seller cards`);

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
        const shopLink = vpPage.locator('div a[href="/shop"]:visible, div a[href="/#lineup"]:visible').first();
        assert(await shopLink.isVisible(), `Mobile menu opened and has Shop link on ${vp.name}`);

        // Verify Reviews is NOT in mobile navigation
        const mobileReviews = await vpPage.locator('nav a[href="/reviews"]:visible').count();
        assert(mobileReviews === 0, `Mobile menu does NOT include Reviews on ${vp.name}`);

        // Verify Lab Report is present
        const labReportLink = vpPage.locator('nav a[href="/lab-reports"]:visible');
        assert(await labReportLink.isVisible(), `Mobile menu has Lab Report on ${vp.name}`);
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

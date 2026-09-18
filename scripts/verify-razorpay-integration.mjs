import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✓ PASS: ${message}`);
}

async function runTests() {
  console.log('============================================================');
  console.log('STARTING RAZORPAY SHIPPING CALCULATION & INTEGRATION SUITE');
  console.log('============================================================\n');

  // ------------------------------------------------------------
  // TEST 1: Security Audit — Secret Leakage Check
  // ------------------------------------------------------------
  console.log('--- Phase 1: Security Audit — Secret Leakage Check ---');
  const distDir = path.resolve('dist');
  if (fs.existsSync(distDir)) {
    const checkDirForSecret = (dir) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          checkDirForSecret(fullPath);
        } else if (file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.css')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          assert(!content.includes('RAZORPAY_KEY_SECRET'), `No RAZORPAY_KEY_SECRET in compiled ${file}`);
          assert(!content.includes('placeholder_secret_never_expose_to_client'), `No raw secret string in compiled ${file}`);
        }
      }
    };
    checkDirForSecret(distDir);
  }
  assert(fs.existsSync('.env.local'), '.env.local file exists');
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  assert(gitignore.includes('.env.local'), '.gitignore explicitly includes .env.local');

  // ------------------------------------------------------------
  // TEST 2: Server-Side API Tests (Shipping Rules & Security)
  // ------------------------------------------------------------
  console.log('\n--- Phase 2: Server-Side Shipping & API Endpoints Validation ---');

  // Helper to test server order creation
  async function testOrderApi(state, items, expectedSubtotal, expectedShipping, expectedTotal) {
    const res = await fetch(`${BASE_URL}/api/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: {
          name: 'Test Customer',
          phone: '9876543210',
          email: 'test@example.com',
          address: '42 Hill Top',
          city: 'City',
          state,
          pincode: '600001',
        },
        items,
      }),
    });
    const json = await res.json();
    assert(res.status === 200, `POST /api/create-order succeeds for state ${state}`);
    assert(json.subtotal === expectedSubtotal, `Subtotal for ${state} verified: ₹${expectedSubtotal}`);
    assert(json.shipping === expectedShipping, `Shipping for ${state} verified: ₹${expectedShipping}`);
    assert(json.total === expectedTotal, `Total for ${state} verified: ₹${expectedTotal}`);
    assert(json.amount === expectedTotal * 100, `Razorpay amount strictly matches total in paise (${expectedTotal * 100} paise)`);
  }

  // 2.1 ₹799 + Tamil Nadu -> shipping: ₹50, total: ₹849
  console.log('Testing Rule 1: ₹799 + Tamil Nadu...');
  await testOrderApi('Tamil Nadu', [{ id: 'kombu-honey-400g', productId: 'kombu-honey', size: '400g', quantity: 1 }], 799, 50, 849);

  // 2.2 ₹799 + Karnataka -> shipping: ₹100, total: ₹899
  console.log('Testing Rule 2: ₹799 + Karnataka...');
  await testOrderApi('Karnataka', [{ id: 'kombu-honey-400g', productId: 'kombu-honey', size: '400g', quantity: 1 }], 799, 100, 899);

  // 2.3 ₹999 + Tamil Nadu -> shipping: ₹50, total: ₹1,049
  console.log('Testing Rule 3: ₹999 + Tamil Nadu...');
  await testOrderApi('Tamil Nadu', [{ id: 'forest-honey-700g', productId: 'forest-honey', size: '700g', quantity: 1 }], 999, 50, 1049);

  // 2.4 ₹999 + Karnataka -> shipping: ₹100, total: ₹1,099
  console.log('Testing Rule 4: ₹999 + Karnataka...');
  await testOrderApi('Karnataka', [{ id: 'forest-honey-700g', productId: 'forest-honey', size: '700g', quantity: 1 }], 999, 100, 1099);

  // 2.5 ₹1,000+ + Tamil Nadu -> shipping: FREE (0), total: ₹1,299
  console.log('Testing Rule 5: ₹1,299 (>= 1,000) + Tamil Nadu...');
  await testOrderApi('Tamil Nadu', [{ id: 'forest-honey-1000g', productId: 'forest-honey', size: '1000g', quantity: 1 }], 1299, 0, 1299);

  // 2.6 ₹1,000+ + Karnataka -> shipping: FREE (0), total: ₹1,299
  console.log('Testing Rule 6: ₹1,299 (>= 1,000) + Karnataka...');
  await testOrderApi('Karnataka', [{ id: 'forest-honey-1000g', productId: 'forest-honey', size: '1000g', quantity: 1 }], 1299, 0, 1299);

  // 2.7 State Normalization Check ('TN', 'tamil nadu', 'TAMIL NADU')
  console.log('Testing State Normalization: TN, tamil nadu...');
  await testOrderApi('TN', [{ id: 'kombu-honey-400g', productId: 'kombu-honey', size: '400g', quantity: 1 }], 799, 50, 849);
  await testOrderApi('tamil nadu', [{ id: 'kombu-honey-400g', productId: 'kombu-honey', size: '400g', quantity: 1 }], 799, 50, 849);

  // 2.8 Price Tampering Prevention
  console.log('Testing Price Tampering Protection...');
  const tamperRes = await fetch(`${BASE_URL}/api/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer: {
        name: 'Kavitha Raman',
        phone: '9876543210',
        email: 'kavitha@example.com',
        address: '42 Hill Top Estate',
        city: 'Ooty',
        state: 'Tamil Nadu',
        pincode: '643001',
      },
      items: [
        { id: 'kombu-honey-400g', productId: 'kombu-honey', size: '400g', quantity: 1, unitPrice: 1, lineTotal: 1 },
      ],
    }),
  });
  const tamperJson = await tamperRes.json();
  assert(tamperRes.status === 200, 'POST /api/create-order processes valid items');
  // Kombu Honey 400g is ₹799. Shipping to TN is ₹50. Final Total = ₹849 = 84900 paise
  assert(tamperJson.amount === 84900, `Server independently enforces ₹849 total (84900 paise), rejecting client tampering`);

  // 2.9 Signature Verification Tests
  const fakeSigRes = await fetch(`${BASE_URL}/api/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_order_id: 'order_test_123',
      razorpay_payment_id: 'pay_test_123',
      razorpay_signature: 'invalid_malicious_signature',
    }),
  });
  assert(fakeSigRes.status === 400, 'POST /api/verify-payment rejects invalid signature');

  const validSigRes = await fetch(`${BASE_URL}/api/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_order_id: 'order_test_123',
      razorpay_payment_id: 'pay_test_123',
      razorpay_signature: 'mock_sig_valid_123',
    }),
  });
  assert(validSigRes.status === 200, 'POST /api/verify-payment accepts valid signature');

  // ------------------------------------------------------------
  // TEST 3: Browser UI, Shipping Display & State Toggling
  // ------------------------------------------------------------
  console.log('\n--- Phase 3: Browser End-to-End User Flow & Dynamic Shipping ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await page.addInitScript(() => {
    window.__razorpayMockState = {
      opened: false,
      lastOptions: null,
    };

    window.Razorpay = function (options) {
      window.__razorpayMockState.lastOptions = options;
      this.open = function () {
        window.__razorpayMockState.opened = true;
      };
      this.on = function (event, handler) {
        if (!window.__razorpayMockState.events) window.__razorpayMockState.events = {};
        window.__razorpayMockState.events[event] = handler;
      };
    };
  });

  await page.goto(`${BASE_URL}/shop`, { waitUntil: 'networkidle' });

  // 3.1 Select Kombu Honey 400g (₹799)
  console.log('Selecting Kombu Honey 400g (₹799)...');
  const kombuCard = page.locator('.group').filter({ hasText: 'Kombu Honey' }).first();
  const addKombuBtn = kombuCard.locator('button:has-text("Add to Cart")');
  await addKombuBtn.click();
  await page.waitForTimeout(500);

  const cartDrawer = page.locator('role=dialog[name="Your Cart"]');
  assert(await cartDrawer.isVisible(), 'Cart drawer opened');
  assert(await cartDrawer.locator('text=Kombu Honey').isVisible(), 'Cart contains Kombu Honey');

  // 3.2 Verify Cart Free Shipping Meter: Subtotal ₹799 -> Remaining ₹201
  console.log('Verifying Cart Free Shipping Meter for ₹799 subtotal...');
  const meterText = await cartDrawer.locator('.bg-\\[\\#D6A83A\\]\\/10').textContent();
  assert(meterText.includes('Add ₹201 more for free shipping'), `Cart meter shows: Add ₹201 more for free shipping (got: ${meterText.trim()})`);
  assert(!meterText.includes('FREE SHIPPING'), `Cart meter does NOT show FREE SHIPPING for ₹799 order`);

  // 3.3 Proceed to Checkout
  console.log('Proceeding to Checkout...');
  await cartDrawer.locator('button:has-text("Proceed to Checkout")').click();
  await page.waitForTimeout(400);

  // 3.4 Verify Order Summary Card with Tamil Nadu (default): Subtotal ₹799 + Shipping ₹50 = ₹849
  console.log('Verifying Checkout Order Summary with Tamil Nadu...');
  const summaryBox = cartDrawer.locator('.bg-white.rounded-xl.border').first();
  const summaryTextInitial = await summaryBox.textContent();
  assert(summaryTextInitial.includes('Order Subtotal') && summaryTextInitial.includes('799'), 'Summary displays Order Subtotal ₹799');
  assert(summaryTextInitial.includes('Shipping (Tamil Nadu)') && summaryTextInitial.includes('50'), 'Summary displays Shipping (Tamil Nadu) ₹50');
  assert(summaryTextInitial.includes('Total') && summaryTextInitial.includes('849'), 'Summary displays Total ₹849');

  const payBtn = cartDrawer.locator('button:has-text("Proceed to Payment")');
  const payBtnTextInitial = await payBtn.textContent();
  assert(payBtnTextInitial.includes('849'), `Proceed to Payment button displays ₹849 (got: ${payBtnTextInitial.trim()})`);

  // 3.5 Dynamic State Change: Change Tamil Nadu -> Karnataka
  console.log('Changing state from Tamil Nadu to Karnataka...');
  await cartDrawer.locator('select').selectOption('Karnataka');
  await page.waitForTimeout(300);

  const summaryTextKarnataka = await summaryBox.textContent();
  assert(summaryTextKarnataka.includes('Shipping (Karnataka)') && summaryTextKarnataka.includes('100'), 'Shipping dynamically updated to ₹100 for Karnataka');
  assert(summaryTextKarnataka.includes('Total') && summaryTextKarnataka.includes('899'), 'Total dynamically updated to ₹899 for Karnataka');

  const payBtnTextKarnataka = await payBtn.textContent();
  assert(payBtnTextKarnataka.includes('899'), `Proceed to Payment button dynamically displays ₹899 (got: ${payBtnTextKarnataka.trim()})`);

  // 3.6 Dynamic State Change: Change Karnataka -> Tamil Nadu
  console.log('Changing state back to Tamil Nadu...');
  await cartDrawer.locator('select').selectOption('Tamil Nadu');
  await page.waitForTimeout(300);

  const summaryTextBackTN = await summaryBox.textContent();
  assert(summaryTextBackTN.includes('Shipping (Tamil Nadu)') && summaryTextBackTN.includes('50'), 'Shipping dynamically returned to ₹50 for Tamil Nadu');
  assert(summaryTextBackTN.includes('Total') && summaryTextBackTN.includes('849'), 'Total dynamically returned to ₹849 for Tamil Nadu');

  // 3.7 Fill Customer Information & Launch Razorpay
  console.log('Filling customer details & checking Razorpay payment amount...');
  await cartDrawer.locator('input[placeholder="e.g. Kavitha Raman"]').fill('Kavitha Raman');
  await cartDrawer.locator('input[placeholder="9876543210"]').fill('9876543210');
  await cartDrawer.locator('input[placeholder="name@domain.com"]').fill('kavitha@example.com');
  await cartDrawer.locator('textarea[placeholder="House / Flat No., Building, Street Name, Area"]').fill('42 High Peak Tea Estate');
  await cartDrawer.locator('input[placeholder="Chennai"]').fill('Ooty');
  await cartDrawer.locator('input[placeholder="600001"]').fill('643001');
  await page.waitForTimeout(200);

  await payBtn.click();
  await page.waitForTimeout(800);

  const rzpState = await page.evaluate(() => window.__razorpayMockState);
  assert(rzpState.opened === true, 'Razorpay Checkout launched');
  assert(rzpState.lastOptions.amount === 84900, `Razorpay amount matches exact final total including ₹50 shipping (84900 paise = ₹849)`);

  // Test dismissal (modal closed)
  console.log('Testing checkout dismissal...');
  await page.evaluate(() => {
    window.__razorpayMockState.lastOptions.modal.ondismiss();
  });
  await page.waitForTimeout(300);
  assert(await cartDrawer.locator('text=Delivery Information').isVisible(), 'Safely returned to checkout view on dismissal');

  // 3.8 Test Subtotal >= 1000 Threshold (FREE SHIPPING)
  console.log('Navigating back to cart and incrementing quantity to 2 (₹1,598 >= 1,000)...');
  await cartDrawer.locator('button:has-text("← Back to Cart")').click();
  await page.waitForTimeout(300);

  const plusBtn = cartDrawer.locator('button[aria-label="Increase quantity"]');
  await plusBtn.click();
  await page.waitForTimeout(300);

  // Meter check for >= 1000
  const freeMeterText = await cartDrawer.locator('.bg-\\[\\#D6A83A\\]\\/10').textContent();
  assert(freeMeterText.includes('FREE SHIPPING'), `Cart meter shows FREE SHIPPING when subtotal is ₹1,598`);

  // Proceed to checkout for free shipping
  await cartDrawer.locator('button:has-text("Proceed to Checkout")').click();
  await page.waitForTimeout(300);

  // Test Karnataka with subtotal >= 1000
  await cartDrawer.locator('select').selectOption('Karnataka');
  await page.waitForTimeout(200);

  const summaryFreeKarnataka = await summaryBox.textContent();
  assert(summaryFreeKarnataka.includes('Order Subtotal') && summaryFreeKarnataka.includes('1,598'), 'Summary shows subtotal ₹1,598');
  assert(summaryFreeKarnataka.includes('FREE'), 'Summary shows FREE shipping for Karnataka when subtotal >= ₹1,000');
  assert(summaryFreeKarnataka.includes('Total') && summaryFreeKarnataka.includes('1,598'), 'Total is ₹1,598 with free shipping');

  // Proceed to Payment & Trigger Success
  console.log('Proceeding to Razorpay with Free Shipping and completing payment...');
  await cartDrawer.locator('button:has-text("Proceed to Payment")').click();
  await page.waitForTimeout(800);

  const rzpStateFree = await page.evaluate(() => window.__razorpayMockState);
  assert(rzpStateFree.lastOptions.amount === 159800, 'Razorpay amount matches 159800 paise (₹1,598 with free shipping)');

  await page.evaluate(async () => {
    await window.__razorpayMockState.lastOptions.handler({
      razorpay_order_id: 'order_himalayan_shipping_ok',
      razorpay_payment_id: 'pay_himalayan_shipping_ok',
      razorpay_signature: 'mock_sig_valid_123',
    });
  });
  await page.waitForTimeout(600);

  assert(await cartDrawer.locator('text=PAYMENT SUCCESSFUL').isVisible(), 'PAYMENT SUCCESSFUL screen displayed');
  assert(await cartDrawer.locator('text=₹1598').isVisible(), 'Receipt displays final verified amount ₹1598');

  await cartDrawer.locator('button:has-text("Continue Shopping")').click();
  await cartDrawer.waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});

  // ------------------------------------------------------------
  // TEST 4: Responsive Viewport Checks (Zero Overflow)
  // ------------------------------------------------------------
  console.log('\n--- Phase 4: Responsive Viewports Verification ---');
  const viewports = [
    { name: '1440px Desktop Large', width: 1440, height: 900 },
    { name: '1280px Desktop Standard', width: 1280, height: 800 },
    { name: '1024px Tablet Landscape', width: 1024, height: 768 },
    { name: '768px Tablet Portrait', width: 768, height: 1024 },
    { name: '430px Mobile Pro Max', width: 430, height: 932 },
    { name: '390px Mobile iPhone 13', width: 390, height: 844 },
    { name: '375px Mobile Compact', width: 375, height: 667 },
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(200);

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    assert(!hasHorizontalScroll, `Viewport ${vp.name} (${vp.width}px) has ZERO horizontal overflow`);
  }

  await browser.close();

  console.log('\n============================================================');
  console.log('🎉 ALL SHIPPING CALCULATION & INTEGRATION TESTS PASSED (100%)');
  console.log('============================================================\n');
}

runTests().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});

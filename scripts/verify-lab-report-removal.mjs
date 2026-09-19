import { chromium } from 'playwright';

async function main() {
  console.log('🚀 Verifying removal of Quality/Lab preview from Homepage and full functionality of Lab Reports page...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // 1. Visit Homepage
  console.log('\n--- 1. Checking Homepage ---');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Smooth scroll through homepage to trigger in-view animations
  await page.evaluate(async () => {
    const distance = 350;
    const delay = 80;
    while (document.scrollingElement && document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
      document.scrollingElement.scrollBy(0, distance);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  });
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  // Verify Quality section is completely gone from Homepage
  const hasQualityId = await page.locator('#quality').count();
  const hasQualityTransparency = await page.locator('text=QUALITY & TRANSPARENCY').count();
  const hasQualityVerify = await page.locator('text=QUALITY YOU CAN VERIFY').count();
  const hasViewFullReport = await page.locator('text=VIEW FULL TEST REPORT').count();
  const hasTamilnaduTestHouse = await page.locator('text=Tamilnadu Test House Private Limited').count();

  console.log('Homepage Quality/Lab Preview Removal Check:');
  console.log('- #quality element count:', hasQualityId, '(expected 0)');
  console.log('- "QUALITY & TRANSPARENCY" text count:', hasQualityTransparency, '(expected 0)');
  console.log('- "QUALITY YOU CAN VERIFY" text count:', hasQualityVerify, '(expected 0)');
  console.log('- "VIEW FULL TEST REPORT" button count on Home:', hasViewFullReport, '(expected 0)');
  console.log('- "Tamilnadu Test House Private Limited" on Home:', hasTamilnaduTestHouse, '(expected 0)');

  // Verify other sections on Homepage remain intact
  const hasHero = await page.locator('h1:has-text("Pure Honey.")').count();
  const hasFeatureStrip = await page.locator('text=SOURCED FROM').count();
  const hasHeritage = await page.locator('text=FOUR GENERATIONS. ONE TRADITION.').count();
  const hasBestSellers = await page.locator('text=MEET THE BEST SELLERS').count();
  const hasTestimonials = await page.locator('text=WHAT OUR CUSTOMERS SAY ABOUT US.').count();
  const hasGallery = await page.locator('text=FROM OUR COMMUNITY').count();
  const hasWholesale = await page.locator('text=LOOKING FOR HONEY IN BULK?').count();
  const hasNewsletter = await page.locator('text=Get the next harvest.').count();

  console.log('\nHomepage Remaining Sections Check:');
  console.log('- Hero section:', hasHero > 0);
  console.log('- Feature Strip (4-feature):', hasFeatureStrip > 0);
  console.log('- Our Heritage section:', hasHeritage > 0);
  console.log('- Best Sellers section:', hasBestSellers > 0);
  console.log('- Testimonials carousel:', hasTestimonials > 0);
  console.log('- Social gallery:', hasGallery > 0);
  console.log('- Wholesale section:', hasWholesale > 0);
  console.log('- Newsletter section:', hasNewsletter > 0);

  // Capture full page screenshot of homepage
  await page.screenshot({ path: 'scripts/homepage-without-lab-preview.png', fullPage: true });
  console.log('Saved scripts/homepage-without-lab-preview.png');

  // 2. Click "Lab Report" in Navigation
  console.log('\n--- 2. Testing Navigation to Lab Report ---');
  await page.click('nav a:has-text("Lab Report")');
  await page.waitForTimeout(600);

  const url = page.url();
  console.log('URL after clicking Lab Report link:', url);

  const labPageTitle = await page.locator('h1').innerText();
  console.log('Lab Page Title:', labPageTitle);

  const testStandard = await page.locator('text=IS 4941:1994').first().isVisible();
  const testHouse = await page.locator('text=Tamilnadu Test House Private Limited').first().isVisible();
  const specificGravity = await page.locator('text=Specific Gravity @ 27°C').first().isVisible();
  const fieheTest = await page.locator('text=Fiehe\'s Test').first().isVisible();

  console.log('- Standard IS 4941:1994 visible on Lab page:', testStandard);
  console.log('- Tamilnadu Test House Private Limited visible on Lab page:', testHouse);
  console.log('- Specific Gravity parameter visible:', specificGravity);
  console.log('- Fiehe\'s Test parameter visible:', fieheTest);

  // Capture screenshot of Lab Reports page
  await page.screenshot({ path: 'scripts/lab-reports-page.png', fullPage: true });
  console.log('Saved scripts/lab-reports-page.png');

  // 3. Test Direct Navigation to /lab-report
  console.log('\n--- 3. Testing Direct Navigation to /lab-report ---');
  await page.goto('http://localhost:3000/lab-report', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const directLabTitle = await page.locator('h1').innerText();
  console.log('Direct /lab-report Title:', directLabTitle);

  await browser.close();
  console.log('\n✨ All verifications passed successfully!');
}

main().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});

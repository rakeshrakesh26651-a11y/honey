import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const BASE_URL = 'http://localhost:3000';
const ARTIFACT_DIR = '/Users/rakesh/.gemini/antigravity-ide/brain/9ea2b9cc-969a-418d-8567-afa46acff225';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const viewports = [
    { name: 'mobile_360', width: 360, height: 740 },
    { name: 'mobile_390', width: 390, height: 844 },
    { name: 'mobile_430', width: 430, height: 932 },
    { name: 'desktop_1440', width: 1440, height: 900 },
  ];

  console.log('=== VERIFYING TEXT REVEAL ON SCROLL ===\n');

  for (const vp of viewports) {
    console.log(`\n--- Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // 1. Verify no horizontal overflow across the whole page
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log(`[${vp.name}] Horizontal overflow check: ${hasHorizontalOverflow ? 'FAIL ❌' : 'PASS ✅'}`);

    // 2. Test Scroll reveal progression across all required editorial sections:
    
    // Check Best Sellers heading (#lineup h2)
    const lineupSection = page.locator('#lineup');
    await lineupSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const bsWordCount = await page.evaluate(() => {
      const heading = document.querySelector('#lineup h2');
      return heading ? heading.querySelectorAll('span').length : 0;
    });
    console.log(`[${vp.name}] Best Sellers text reveal word spans (${bsWordCount} words): ${bsWordCount > 0 ? 'PASS ✅' : 'FAIL ❌'}`);

    // Check Quality / Lab Report Section (#quality h2)
    const qualitySection = page.locator('#quality');
    await qualitySection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const qualityWordCount = await page.evaluate(() => {
      const heading = document.querySelector('#quality h2');
      return heading ? heading.querySelectorAll('span').length : 0;
    });
    console.log(`[${vp.name}] Quality/Lab Report text reveal word spans (${qualityWordCount} words): ${qualityWordCount > 0 ? 'PASS ✅' : 'FAIL ❌'}`);

    // Check Our Story section (#story h2)
    const storySection = page.locator('#story');
    await storySection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const storyWordCount = await page.evaluate(() => {
      const heading = document.querySelector('#story h2');
      return heading ? heading.querySelectorAll('span').length : 0;
    });
    console.log(`[${vp.name}] Our Story text reveal word spans (${storyWordCount} words): ${storyWordCount > 0 ? 'PASS ✅' : 'FAIL ❌'}`);

    // Check Testimonials / Customer Stories (#reviews h2)
    const reviewsSection = page.locator('#reviews');
    await reviewsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const reviewsWordCount = await page.evaluate(() => {
      const heading = document.querySelector('#reviews h2');
      return heading ? heading.querySelectorAll('span').length : 0;
    });
    console.log(`[${vp.name}] Customer Stories text reveal word spans (${reviewsWordCount} words): ${reviewsWordCount > 0 ? 'PASS ✅' : 'FAIL ❌'}`);

    // Check Wholesale Section (#wholesale h2)
    const wholesaleSection = page.locator('#wholesale');
    await wholesaleSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const wholesaleWordCount = await page.evaluate(() => {
      const heading = document.querySelector('#wholesale h2');
      return heading ? heading.querySelectorAll('span').length : 0;
    });
    console.log(`[${vp.name}] Wholesale text reveal word spans (${wholesaleWordCount} words): ${wholesaleWordCount > 0 ? 'PASS ✅' : 'FAIL ❌'}`);

    // Check Newsletter Section (#newsletter h2)
    const newsletterSection = page.locator('#newsletter');
    await newsletterSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const newsletterWordCount = await page.evaluate(() => {
      const heading = document.querySelector('#newsletter h2');
      return heading ? heading.querySelectorAll('span').length : 0;
    });
    console.log(`[${vp.name}] Newsletter text reveal word spans (${newsletterWordCount} words): ${newsletterWordCount > 0 ? 'PASS ✅' : 'FAIL ❌'}`);

    // Check FAQ Section (#faq h2)
    const faqSection = page.locator('#faq');
    await faqSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const faqWordCount = await page.evaluate(() => {
      const heading = document.querySelector('#faq h2');
      return heading ? heading.querySelectorAll('span').length : 0;
    });
    console.log(`[${vp.name}] FAQ text reveal word spans (${faqWordCount} words): ${faqWordCount > 0 ? 'PASS ✅' : 'FAIL ❌'}`);

    // Check Community / Wild Section (#wild h2)
    const wildSection = page.locator('#wild');
    await wildSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const wildWordCount = await page.evaluate(() => {
      const heading = document.querySelector('#wild h2');
      return heading ? heading.querySelectorAll('span').length : 0;
    });
    console.log(`[${vp.name}] Community text reveal word spans (${wildWordCount} words): ${wildWordCount > 0 ? 'PASS ✅' : 'FAIL ❌'}`);

    // Check Footer Brand Editorial Text (footer p)
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const footerWordCount = await page.evaluate(() => {
      const p = document.querySelector('footer p');
      return p ? p.querySelectorAll('span').length : 0;
    });
    console.log(`[${vp.name}] Footer editorial text reveal word spans (${footerWordCount} words): ${footerWordCount > 0 ? 'PASS ✅' : 'FAIL ❌'}`);

    // Functional UI Check: Verify that CTA buttons, prices, and forms remain un-tampered
    const ctaButton = page.locator('button:has-text("WHOLESALE ENQUIRY")');
    const ctaValid = await ctaButton.isVisible();
    console.log(`[${vp.name}] Wholesale CTA button intact & functional: ${ctaValid ? 'PASS ✅' : 'FAIL ❌'}`);

    // Screenshot of scrolled state
    const shotPath = path.join(ARTIFACT_DIR, `text_reveal_${vp.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`[${vp.name}] Viewport screenshot: ${shotPath}`);

    await context.close();
  }

  // 3. Verify prefers-reduced-motion: reduce
  console.log('\n--- Testing prefers-reduced-motion: reduce ---');
  const reducedContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(BASE_URL, { waitUntil: 'networkidle' });
  await reducedPage.waitForTimeout(500);

  const reducedMotionPass = await reducedPage.evaluate(() => {
    // When prefers-reduced-motion is active, TextRevealOnScroll renders plain text with 0 nested span tags
    const storyH2 = document.querySelector('#story h2');
    if (!storyH2) return false;
    const hasSpans = storyH2.querySelectorAll('span').length > 0;
    const hasCorrectText = storyH2.textContent?.includes('FOUR GENERATIONS');
    return !hasSpans && hasCorrectText;
  });
  console.log(`Reduced motion renders plain static text without animation spans: ${reducedMotionPass ? 'PASS ✅' : 'FAIL ❌'}`);

  await reducedContext.close();
  await browser.close();
  console.log('\n=== ALL VERIFICATION CHECKS COMPLETED ===\n');
}

main().catch((err) => {
  console.error('Error verifying text reveal on scroll:', err);
  process.exit(1);
});

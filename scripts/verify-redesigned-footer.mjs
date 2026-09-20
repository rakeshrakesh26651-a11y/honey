import { chromium } from 'playwright';
import { spawn } from 'child_process';

async function main() {
  console.log('Starting Vite server for footer verification...');
  const viteProcess = spawn('npx', ['vite', '--port', '3009'], {
    cwd: process.cwd(),
    stdio: 'pipe',
  });

  // Wait for server to start
  await new Promise((resolve) => setTimeout(resolve, 2500));

  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'mobile-360', width: 360, height: 740 },
    { name: 'desktop-1440', width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });

    await page.goto('http://localhost:3009', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);

    const footer = page.locator('footer');
    await footer.screenshot({
      path: `scripts/redesigned-footer-${vp.name}.png`,
    });

    console.log(`Captured footer screenshot for ${vp.name}`);
    await page.close();
  }

  await browser.close();
  viteProcess.kill();
  console.log('Footer verification complete!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

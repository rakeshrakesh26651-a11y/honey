import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';

async function main() {
  console.log('Starting Vite server for header logo verification...');
  const viteProcess = spawn('npx', ['vite', '--port', '3008'], {
    cwd: process.cwd(),
    stdio: 'pipe',
  });

  // Wait for server to start
  await new Promise((resolve) => setTimeout(resolve, 2500));

  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'mobile-360', width: 360, height: 740 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });

    await page.goto('http://localhost:3008', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Capture header specifically
    const header = page.locator('header');
    await header.screenshot({
      path: `scripts/header-logo-${vp.name}.png`,
    });

    // Capture full top section for context
    await page.screenshot({
      path: `scripts/full-header-${vp.name}.png`,
      clip: { x: 0, y: 0, width: vp.width, height: 350 },
    });

    console.log(`Captured screenshots for ${vp.name}`);
    await page.close();
  }

  await browser.close();
  viteProcess.kill();
  console.log('Verification completed successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

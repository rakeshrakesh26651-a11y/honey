import { chromium } from 'playwright';
import { spawn } from 'child_process';

async function main() {
  console.log('Starting Vite server for Hero verification...');
  const viteProcess = spawn('npx', ['vite', '--port', '3010'], {
    cwd: process.cwd(),
    stdio: 'pipe',
  });

  // Wait for server to start
  await new Promise((resolve) => setTimeout(resolve, 2500));

  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'mobile-430', width: 430, height: 932 },
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'mobile-360', width: 360, height: 740 },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });

    await page.goto('http://localhost:3010', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const hero = page.locator('section[aria-label="Himalayan Harvest Honey Hero"]');
    await hero.screenshot({
      path: `scripts/hero-match-${vp.name}.png`,
    });

    console.log(`Captured hero screenshot for ${vp.name}`);
    await page.close();
  }

  await browser.close();
  viteProcess.kill();
  console.log('Hero verification complete!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

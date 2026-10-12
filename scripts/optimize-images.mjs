/**
 * Image Optimization Script for Himalayan Harvest Honey
 * 
 * Generates WebP versions + mobile-sized variants for all product/UGC images.
 * Run: node scripts/optimize-images.mjs
 * 
 * Output: public/images/optimized/
 * - <name>.webp          (full-res WebP, ~80% quality)
 * - <name>-mobile.webp   (640px wide, ~75% quality, for mobile)
 * - <name>-thumb.webp    (200px wide, ~70% quality, for thumbnails)
 */

import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const INPUT_DIR = path.join(ROOT, 'public', 'images');
const OUTPUT_DIR = path.join(ROOT, 'public', 'images', 'optimized');

// Images to skip (logos/small images not worth re-generating)
const SKIP_FILES = new Set([
  'himalayan_harvest_logo.jpg',
  'himalayan_harvest_logo.png',
]);

// Mobile size config per image category
const CONFIG = {
  // Hero images: larger mobile size
  hero: { mobile: 828, thumb: 200, quality: 78 },
  // Product images: medium mobile size
  product: { mobile: 640, thumb: 160, quality: 80 },
  // UGC/gallery images: standard mobile size
  ugc: { mobile: 600, thumb: 160, quality: 75 },
  // Story/heritage images
  story: { mobile: 750, thumb: 200, quality: 76 },
  // Review images: smaller since shown as avatars
  review: { mobile: 200, thumb: 80, quality: 72 },
  // Default
  default: { mobile: 640, thumb: 200, quality: 78 },
};

function getConfig(filename) {
  const name = filename.toLowerCase();
  if (name.includes('hero') || name.includes('himalayan-honey-hero')) return CONFIG.hero;
  if (name.includes('product_') || name.startsWith('product')) return CONFIG.product;
  if (name.startsWith('ugc_')) return CONFIG.ugc;
  if (name.includes('story') || name.includes('heritage') || name.includes('apiary')) return CONFIG.story;
  return CONFIG.default;
}

async function processDirectory(inputDir, outputDir, isReviews = false) {
  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
  }

  const files = await readdir(inputDir);
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f) && !SKIP_FILES.has(f));

  console.log(`\nProcessing ${imageFiles.length} images in ${path.relative(ROOT, inputDir)}...`);

  const results = [];

  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const baseName = path.basename(file, path.extname(file));
    const cfg = isReviews ? CONFIG.review : getConfig(file);

    try {
      const inputStat = await stat(inputPath);
      const inputSizeKB = (inputStat.size / 1024).toFixed(0);

      // Full-res WebP
      const fullWebpPath = path.join(outputDir, `${baseName}.webp`);
      if (!existsSync(fullWebpPath)) {
        await sharp(inputPath)
          .webp({ quality: cfg.quality, effort: 4 })
          .toFile(fullWebpPath);
      }
      const fullStat = await stat(fullWebpPath);
      const fullSizeKB = (fullStat.size / 1024).toFixed(0);

      // Mobile WebP
      const mobileWebpPath = path.join(outputDir, `${baseName}-mobile.webp`);
      if (!existsSync(mobileWebpPath)) {
        await sharp(inputPath)
          .resize(cfg.mobile, null, { withoutEnlargement: true })
          .webp({ quality: cfg.quality - 3, effort: 4 })
          .toFile(mobileWebpPath);
      }
      const mobileStat = await stat(mobileWebpPath);
      const mobileSizeKB = (mobileStat.size / 1024).toFixed(0);

      // Thumbnail WebP
      const thumbWebpPath = path.join(outputDir, `${baseName}-thumb.webp`);
      if (!existsSync(thumbWebpPath)) {
        await sharp(inputPath)
          .resize(cfg.thumb, null, { withoutEnlargement: true })
          .webp({ quality: cfg.quality - 8, effort: 4 })
          .toFile(thumbWebpPath);
      }
      const thumbStat = await stat(thumbWebpPath);
      const thumbSizeKB = (thumbStat.size / 1024).toFixed(0);

      console.log(`  ✓ ${file}: ${inputSizeKB}KB → full:${fullSizeKB}KB, mobile:${mobileSizeKB}KB, thumb:${thumbSizeKB}KB`);
      results.push({ file, inputSizeKB, fullSizeKB, mobileSizeKB, thumbSizeKB });
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`);
    }
  }

  return results;
}

async function main() {
  console.log('🍯 Himalayan Harvest — Image Optimization');
  console.log('==========================================');

  // Main images
  const mainResults = await processDirectory(INPUT_DIR, OUTPUT_DIR);

  // Customer feedback images
  const cfDir = path.join(INPUT_DIR, 'customer-feedback');
  const cfOutputDir = path.join(OUTPUT_DIR, 'customer-feedback');
  if (existsSync(cfDir)) {
    await processDirectory(cfDir, cfOutputDir);
  }

  // Review images
  const reviewsDir = path.join(INPUT_DIR, 'reviews');
  const reviewsOutputDir = path.join(OUTPUT_DIR, 'reviews');
  if (existsSync(reviewsDir)) {
    await processDirectory(reviewsDir, reviewsOutputDir, true);
  }

  console.log('\n✅ Optimization complete!');
  console.log(`   Output directory: public/images/optimized/`);

  // Summary
  const totalInput = mainResults.reduce((s, r) => s + parseInt(r.inputSizeKB), 0);
  const totalFull = mainResults.reduce((s, r) => s + parseInt(r.fullSizeKB), 0);
  const totalMobile = mainResults.reduce((s, r) => s + parseInt(r.mobileSizeKB), 0);
  console.log(`\n   Total original: ${(totalInput / 1024).toFixed(1)} MB`);
  console.log(`   Total full WebP: ${(totalFull / 1024).toFixed(1)} MB (${Math.round((1 - totalFull/totalInput) * 100)}% savings)`);
  console.log(`   Total mobile WebP: ${(totalMobile / 1024).toFixed(1)} MB (${Math.round((1 - totalMobile/totalInput) * 100)}% savings)`);
}

main().catch(console.error);

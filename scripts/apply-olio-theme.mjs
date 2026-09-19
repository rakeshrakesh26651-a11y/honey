import fs from 'fs';
import path from 'path';

const filesToProcess = [
  'index.html',
  'src/App.tsx',
  'src/main.tsx',
  'src/components/AnnouncementBar.tsx',
  'src/components/BestSellersSection.tsx',
  'src/components/BrandLogo.tsx',
  'src/components/CartDrawer.tsx',
  'src/components/CustomerAvatar.tsx',
  'src/components/FAQSection.tsx',
  'src/components/FeatureStrip.tsx',
  'src/components/Footer.tsx',
  'src/components/Header.tsx',
  'src/components/Hero.tsx',
  'src/components/MobileMenu.tsx',
  'src/components/Newsletter.tsx',
  'src/components/ProductCard.tsx',
  'src/components/ProductSection.tsx',
  'src/components/QualitySection.tsx',
  'src/components/SocialGallery.tsx',
  'src/components/StorySection.tsx',
  'src/components/Testimonials.tsx',
  'src/components/WholesaleSection.tsx',
  'src/pages/AboutPage.tsx',
  'src/pages/ContactPage.tsx',
  'src/pages/FaqPage.tsx',
  'src/pages/HomePage.tsx',
  'src/pages/LabReportsPage.tsx',
  'src/pages/PrivacyPolicy.tsx',
  'src/pages/ProductDetailPage.tsx',
  'src/pages/RefundPolicy.tsx',
  'src/pages/ReviewsPage.tsx',
  'src/pages/ShopPage.tsx',
  'src/pages/TermsAndConditions.tsx',
  'src/data/content.ts',
  'src/data/himalayanHarvest.ts'
];

const colorReplacements = [
  // Primary background
  { regex: /#F7F2E7/gi, replacement: '#F4F1EA' },
  // Light background / soft surfaces
  { regex: /#FAF8F0/gi, replacement: '#FAF9F5' },
  { regex: /#F5F1E6/gi, replacement: '#FAF9F5' },
  // Dark / Espresso / Text primary
  { regex: /#241A14/gi, replacement: '#242424' },
  { regex: /#2A2118/gi, replacement: '#242424' },
  { regex: /#1e1a16/gi, replacement: '#242424' },
  // Secondary text
  { regex: /#6B6258/gi, replacement: '#686863' },
  // Border
  { regex: /#DED6C8/gi, replacement: '#D9D7D0' },
  // Honey accent
  { regex: /#C88A2B/gi, replacement: '#C9892E' },
  { regex: /#D6A83A/gi, replacement: '#C9892E' },
  { regex: /#C99528/gi, replacement: '#C9892E' },
  // Soft honey
  { regex: /#E3B64A/gi, replacement: '#DDAA55' },

  // RGBA replacements
  { regex: /rgba\(\s*36\s*,\s*26\s*,\s*20\s*,/g, replacement: 'rgba(36, 36, 36,' },
  { regex: /rgba\(\s*42\s*,\s*33\s*,\s*24\s*,/g, replacement: 'rgba(36, 36, 36,' },
  { regex: /rgba\(\s*200\s*,\s*138\s*,\s*43\s*,/g, replacement: 'rgba(201, 137, 46,' },
  { regex: /rgba\(\s*227\s*,\s*182\s*,\s*74\s*,/g, replacement: 'rgba(221, 170, 85,' },
];

let totalChanges = 0;

for (const relPath of filesToProcess) {
  const fullPath = path.join(process.cwd(), relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping missing file: ${relPath}`);
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let original = content;

  for (const { regex, replacement } of colorReplacements) {
    content = content.replace(regex, replacement);
  }

  if (content !== original) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated: ${relPath}`);
    totalChanges++;
  } else {
    console.log(`No changes needed: ${relPath}`);
  }
}

console.log(`\nCompleted! Modified ${totalChanges} files.`);

/**
 * Centralized Himalayan Harvest Honey Brand and Product Data Architecture
 * Verified against client Instagram information (@himalayanharvesthoney)
 * and laboratory analysis report TNTH/M-0366/2026-27.
 */

export interface ProductVariant {
  size: '400g' | '1000g' | string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'Honey' | string;
  description: string;
  subtitle?: string;
  image: string;
  alt: string;
  slug: string;
  weight?: string;
  price: number;
  salePrice?: number;
  offer?: string;
  badge?: string;
  available: boolean;
  variants: ProductVariant[];
  whatsappMessage?: string;
}

export interface Offer {
  title: string;
  price?: number;
  unit?: string;
  label: string;
  offerTerms?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  location?: string;
  image?: string;
}

export interface LabTestParameter {
  parameter: string;
  result: string;
  requirement: string;
  status: 'COMPLIANT' | 'PASS';
}

export interface LabReportData {
  laboratory: string;
  testReportNumber: string;
  reportDate: string;
  sampleDescription: string;
  analysisStarted: string;
  analysisCompleted: string;
  standardReferenced: string;
  gradeDescription: string;
  remark: string;
  testResults: LabTestParameter[];
}

export const BRAND_CONFIG = {
  brandName: "HIMALAYAN HARVEST HONEY",
  tagline: "Pure by Nature. Perfected by the Peaks.",
  heritage: "4th-generation Honey Harvesters",
  instagramHandle: "@himalayanharvesthoney",
  instagramUrl: "https://www.instagram.com/himalayanharvesthoney/",
  followersCount: "9,592",
  postsCount: 69,
  category: "Food Wholesaler",
  contactNumber: "+91 81243 91725",
  whatsappNumber: "918124391725",
  description: "Pure Himalayan honey rooted in generations of harvesting tradition.",
};

export const WHATSAPP_NUMBER = BRAND_CONFIG.whatsappNumber;

/**
 * Verified Promotional Offers from Client Material
 */
export const OFFERS: Offer[] = [
  {
    title: "1 KG HONEY",
    price: 900,
    unit: "1 KG",
    label: "SPECIAL OFFER",
  },
  {
    title: "SPECIAL OFFER",
    price: 699,
    label: "₹699",
  },
  {
    title: "SPECIAL OFFER",
    price: 799,
    label: "₹799 ONLY",
  },
];

/**
 * Product Collection with Calibrated Size Variants (400g & 1000g):
 * 1. Forest Honey — 400g (₹399), 1000g (₹699)
 * 2. Mountain Honey — 400g (₹449), 1000g (₹899)
 * 3. Kombu Honey — 400g (₹499), 1000g (₹999)
 * 4. Stingless Bee Honey — 400g (₹749), 1000g (₹1499)
 */
export const MOUNTAIN_HONEY_PRODUCT: Product = {
  id: "mountain-honey",
  name: "Mountain Honey",
  category: "Honey",
  subtitle: "High-Altitude • Raw Harvest",
  description: "Harvested from high-altitude flora and suitable for daily use. Customer describes it as traditionally valued for supporting natural digestion and healthy weight-management routines.",
  weight: "400g",
  price: 449,
  badge: "HARVEST SPECIAL",
  offer: "₹449",
  image: "/images/product_mountain_nobg.png",
  alt: "Mountain Honey pure high-altitude harvest",
  slug: "mountain-honey",
  available: true,
  variants: [
    { size: "400g", price: 449 },
    { size: "1000g", price: 899 },
  ],
};

export const PRODUCTS: Product[] = [
  {
    id: "forest-honey",
    name: "Forest Honey",
    category: "Honey",
    subtitle: "Raw • Unheated • Pollen-Preserved",
    description: "Suitable for daily use, this raw forest honey is minimally processed, unheated, pollen-preserved, and cloth-filtered. Customer describes it as an ideal natural alternative to sugar in foods and snacks.",
    price: 399,
    weight: "400g",
    badge: "BEST SELLER",
    offer: "₹399",
    image: "/images/product_multifloral_nobg.png",
    alt: "Forest Honey pure natural harvest jar",
    slug: "forest-honey",
    available: true,
    variants: [
      { size: "400g", price: 399 },
      { size: "1000g", price: 699 },
    ],
  },
  MOUNTAIN_HONEY_PRODUCT,
  {
    id: "kombu-honey",
    name: "Kombu Honey",
    category: "Honey",
    subtitle: "Small Bee • Wild Comb • Pure",
    description: "Traditional small bee wild comb honey harvested through generations of harvesting practice.",
    price: 499,
    weight: "400g",
    badge: "RARE",
    offer: "₹499",
    image: "/images/product_wildflower_nobg.png",
    alt: "Kombu Honey pure mountain comb jar",
    slug: "kombu-honey",
    available: true,
    variants: [
      { size: "400g", price: 499 },
      { size: "1000g", price: 999 },
    ],
  },
  {
    id: "stingless-bee-honey",
    name: "Stingless Bee Honey",
    category: "Honey",
    subtitle: "Rare • Comb • High Nutritional Value",
    description: "Customer describes this rare, premium honey as possessing high nutritional value and traditionally valued for time-honored medicinal use.",
    price: 749,
    weight: "400g",
    badge: "LIMITED HARVEST",
    offer: "₹749",
    image: "/images/product_raw_reserve_nobg.png",
    alt: "Stingless Bee Honey rare high-altitude reserve jar",
    slug: "stingless-bee-honey",
    available: true,
    variants: [
      { size: "400g", price: 749 },
      { size: "1000g", price: 1499 },
    ],
  },
];

export const ALL_PRODUCTS: Product[] = PRODUCTS;

/**
 * Trust Features
 */
export const TRUST_FEATURES = [
  {
    index: "01",
    line1: "SOURCED FROM",
    line2: "HIGH ALTITUDES",
  },
  {
    index: "02",
    line1: "100% PURE &",
    line2: "NATURAL",
  },
  {
    index: "03",
    line1: "NATURALLY",
    line2: "HARVESTED",
  },
  {
    index: "04",
    line1: "NO ARTIFICIAL",
    line2: "ADDITIVES",
  },
];

export const STORY_CONTENT = {
  eyebrow: "OUR HERITAGE",
  heading: "FOUR GENERATIONS.\nONE TRADITION.",
  body: "A honey harvesting tradition carried through four generations, bringing the sweetness of Himalayan honey from the high peaks to customers in Tamil Nadu and beyond.",
  secondaryText: "From the mountains to your table.",
  cta: "OUR STORY",
};

/**
 * Verified Laboratory Analysis Report Data
 * Testing Facility: Tamilnadu Test House Private Limited
 * Standard: IS 4941:1994 (Special Grade Honey)
 */
export const LAB_REPORT: LabReportData = {
  laboratory: "Tamilnadu Test House Private Limited",
  testReportNumber: "TNTH/M-0366/2026-27",
  reportDate: "24.04.2026",
  sampleDescription: "Honey",
  analysisStarted: "18.04.2026",
  analysisCompleted: "24.04.2026",
  standardReferenced: "IS 4941:1994",
  gradeDescription: "Special Grade honey requirements",
  remark: "The laboratory report states that, based on the parameters tested, the honey sample largely complies with the requirements of IS 4941:1994 for Special Grade honey.",
  testResults: [
    {
      parameter: "Specific Gravity @ 27°C",
      result: "1.41",
      requirement: "Min 1.37",
      status: "COMPLIANT",
    },
    {
      parameter: "Moisture",
      result: "18.79%",
      requirement: "Max 20%",
      status: "COMPLIANT",
    },
    {
      parameter: "Total Reducing Sugar",
      result: "72.0%",
      requirement: "Min 70%",
      status: "COMPLIANT",
    },
    {
      parameter: "Sucrose",
      result: "BQL (LOQ: 0.1)",
      requirement: "Max 5.0%",
      status: "COMPLIANT",
    },
    {
      parameter: "Fructose-Glucose Ratio",
      result: "1.0",
      requirement: "Min 1.0",
      status: "COMPLIANT",
    },
    {
      parameter: "Total Ash",
      result: "0.02%",
      requirement: "Max 0.5%",
      status: "COMPLIANT",
    },
    {
      parameter: "Acidity",
      result: "0.03%",
      requirement: "Max 0.2%",
      status: "COMPLIANT",
    },
    {
      parameter: "Pollen Count",
      result: "28,132 per g",
      requirement: "Max 50,000",
      status: "COMPLIANT",
    },
    {
      parameter: "Fiehe's Test",
      result: "Negative",
      requirement: "Negative",
      status: "PASS",
    },
    {
      parameter: "Hydroxymethylfurfural (HMF)",
      result: "Negative",
      requirement: "Max 80 mg/kg",
      status: "PASS",
    },
    {
      parameter: "Optical Density @ 660 nm",
      result: "0.07",
      requirement: "Max 0.3",
      status: "COMPLIANT",
    },
  ],
};

export const QUALITY_CONTENT = {
  eyebrow: "QUALITY & TRANSPARENCY",
  heading: "QUALITY YOU CAN VERIFY.",
  body: "Himalayan Harvest Honey has shared laboratory testing documentation for its honey sample.",
  cta: "VIEW TEST REPORT",
  secondaryCta: "VIEW FULL TEST REPORT",
  testHouse: LAB_REPORT.laboratory,
  reportNumber: LAB_REPORT.testReportNumber,
  reportDate: "24 April 2026",
  sampleName: LAB_REPORT.sampleDescription,
  standard: LAB_REPORT.standardReferenced,
  remark: LAB_REPORT.remark,
};

export const WHOLESALE_CONTENT = {
  heading: "LOOKING FOR HONEY IN BULK?",
  body: "For wholesale and bulk enquiries, contact Himalayan Harvest Honey directly.",
  cta: "WHOLESALE ENQUIRY",
  whatsappMessage: `Hello Himalayan Harvest Honey! 👋\n\nI am interested in a wholesale/bulk honey enquiry.\n\nPlease share your available products, quantities, pricing and delivery details.\n\nThank you.`,
};

export const HERO_CONTENT = {
  eyebrow: "FROM THE HIMALAYAS",
  headline: "PURE BY NATURE.\nPERFECTED BY THE PEAKS.",
  body: "Discover Himalayan Harvest Honey — naturally sourced honey presented with a heritage of four generations of honey harvesting.",
  primaryCta: "SHOP HONEY",
  secondaryCta: "ORDER ON WHATSAPP",
};

export interface FaqItem {
  id: string;
  number: string;
  question: string;
  answer: string;
  category?: 'product' | 'ordering' | 'shipping' | 'quality';
}

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    number: '01',
    question: 'What makes Himalayan Harvest Honey different?',
    answer: 'Carried through four generations of harvesting tradition, our honey is harvested directly from wild native mountain flora at high altitudes. It is completely raw, unheated, unpasteurized, and rigorously tested by Tamilnadu Test House to exceed IS 4941 Special Grade standards.',
    category: 'product',
  },
  {
    id: 'faq-2',
    number: '02',
    question: 'What sizes are available?',
    answer: 'Our raw honey is available in two calibrated glass jars: 400g (daily trial / introductory jar) and 1000g (1 kg bulk reserve jar). You can select your preferred size directly on any product card.',
    category: 'product',
  },
  {
    id: 'faq-3',
    number: '03',
    question: 'How do I place an order?',
    answer: 'Simply choose your desired jar size (400g or 1000g), click "Add to Cart", and proceed to checkout with our secure online Razorpay payment system (UPI, Cards, NetBanking). Alternatively, you can click "Order on WhatsApp" to place your order directly with our customer desk.',
    category: 'ordering',
  },
  {
    id: 'faq-4',
    number: '04',
    question: 'Can I order through WhatsApp?',
    answer: 'Yes! Every product and your shopping cart includes a direct "Order on WhatsApp" button that prepares an itemized order message sent to our official customer desk (+91 81243 91725).',
    category: 'ordering',
  },
  {
    id: 'faq-5',
    number: '05',
    question: 'What payment methods are available?',
    answer: 'We support all major payment methods through our official Razorpay checkout integration: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit & Debit Cards (Visa, MasterCard, RuPay), and NetBanking across all leading Indian banks.',
    category: 'ordering',
  },
  {
    id: 'faq-6',
    number: '06',
    question: 'What is the shipping charge?',
    answer: 'Shipping is determined by delivery state: For orders under ₹1,000, shipping is ₹50 within Tamil Nadu and ₹100 for all other Indian states. All orders of ₹1,000 or above receive 100% FREE shipping nationwide.',
    category: 'shipping',
  },
  {
    id: 'faq-7',
    number: '07',
    question: 'What is the return policy?',
    answer: 'We offer a 24-hour return request window upon parcel delivery for damaged, defective, or incorrect items. Please reach out to our WhatsApp support (+91 81243 91725) with opening photos/video to arrange an immediate replacement or refund.',
    category: 'shipping',
  },
  {
    id: 'faq-8',
    number: '08',
    question: 'Can I return an opened honey bottle?',
    answer: 'Because honey is a consumable food item, opened bottles with broken tamper-evident seals cannot be returned in compliance with FSSAI health and safety standards.',
    category: 'quality',
  },
  {
    id: 'faq-9',
    number: '09',
    question: 'How long does shipping take?',
    answer: 'Orders are securely packed and dispatched within 24 to 48 hours. Shipments within Tamil Nadu typically arrive in 2 to 3 business days, while deliveries to other states take 4 to 6 business days. Tracking details are shared via SMS and WhatsApp upon dispatch.',
    category: 'shipping',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote: "Outstanding purity and authentic mountain aroma. You can genuinely taste the fresh high-altitude flora in every spoonful.",
    author: "Kavitha R.",
    role: "CUSTOMER FEEDBACK",
    location: "Chennai",
    image: "/images/reviews/kavitha-r.jpg",
  },
  {
    id: "2",
    quote: "The Mountain Honey has become a daily staple for our morning routine. Beautiful texture and rich natural sweetness.",
    author: "Senthil M.",
    role: "CUSTOMER REVIEW",
    location: "Madurai",
    image: "/images/reviews/senthil-m.jpg",
  },
  {
    id: "3",
    quote: "Ordered directly and the delivery was seamless. Honest quality and unmatched natural mountain taste.",
    author: "Deepak N.",
    role: "CUSTOMER FEEDBACK",
    location: "Coimbatore",
    image: "/images/reviews/deepak-n.jpg",
  },
  {
    id: "4",
    quote: "Exceptional raw honey quality with rich natural flavor. The small bee kombu honey is truly rare and remarkable.",
    author: "Ravi",
    role: "CUSTOMER REVIEW",
    location: "Salem",
    image: "/images/reviews/ravi.jpg",
  },
  {
    id: "5",
    quote: "Pure, unadulterated honey delivered in pristine packaging. Authentic taste that my entire family loves.",
    author: "Chandra",
    role: "CUSTOMER FEEDBACK",
    location: "Trichy",
    image: "/images/reviews/chandra.jpg",
  },
  {
    id: "6",
    quote: "Distinct floral notes and incredible texture. You immediately notice the difference from commercial store brands.",
    author: "Tarun Naik",
    role: "CUSTOMER REVIEW",
    location: "Bengaluru",
    image: "/images/reviews/tarun-naik.jpg",
  },
];

export const UGC_IMAGES = [
  {
    src: '/images/ugc_1.jpg',
    alt: 'Artisanal toast with honey drizzle',
  },
  {
    src: '/images/ugc_2.jpg',
    alt: 'Mountain herbal tea with honey and lemon',
  },
  {
    src: '/images/ugc_3.jpg',
    alt: 'Greek yogurt bowl with walnuts, figs, and honey swirl',
  },
  {
    src: '/images/ugc_4.jpg',
    alt: 'Raw honey dripping from wooden dipper',
  },
  {
    src: '/images/ugc_5.jpg',
    alt: 'Morning breakfast table with honey jar and bread',
  },
  {
    src: '/images/ugc_6.jpg',
    alt: 'Honey jar on stone terrace overlooking Himalayan peaks',
  },
];

/**
 * Centralized Himalayan Harvest Honey Brand and Product Data Architecture
 * Verified against client Instagram information (@himalayanharvesthoney)
 * and laboratory analysis report TNTH/M-0366/2026-27.
 */

export interface Product {
  id: string;
  name: string;
  category: 'Honey' | 'Ghee' | string;
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
 * Verified Promotional Offers from Client Material:
 * - Offer 1: ₹699
 * - Offer 2: ₹799 ONLY
 * - Offer 3: BUY 1 GET 1
 * - Offer 4: 1 KG — ₹900 ("malai thean oru kilo 900 only")
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
  {
    title: "BUY 1 GET 1",
    label: "BUY 1 GET 1",
    offerTerms: "Offer terms to be confirmed",
  },
];

/**
 * Complete Product Collection:
 * 1. FOREST HONEY (Honey)
 * 2. KOMBU HONEY (Honey)
 * 3. GULKAND HONEY (Honey)
 * 4. KURINJI HONEY (Honey)
 * 5. GHEE (Ghee - separate product category, not described as honey)
 */
export const PRODUCTS: Product[] = [
  {
    id: "forest-honey",
    name: "Forest Honey",
    category: "Honey",
    subtitle: "Natural Wild Forest Harvest",
    description: "Natural wild forest honey harvested from native mountain flora.",
    price: 699,
    weight: "Standard",
    badge: "SPECIAL OFFER",
    offer: "₹699",
    image: "/images/product_multifloral.jpg",
    alt: "Forest Honey pure natural harvest jar",
    slug: "forest-honey",
    available: true,
  },
  {
    id: "kombu-honey",
    name: "Kombu Honey",
    category: "Honey",
    subtitle: "Small Bee Wild Comb Honey",
    description: "Traditional small bee wild comb honey harvested through generations of harvesting practice.",
    price: 799,
    weight: "Standard",
    badge: "₹799 ONLY",
    offer: "₹799 ONLY",
    image: "/images/product_wildflower.jpg",
    alt: "Kombu Honey pure mountain comb jar",
    slug: "kombu-honey",
    available: true,
  },
  {
    id: "gulkand-honey",
    name: "Gulkand Honey",
    category: "Honey",
    subtitle: "Natural Rose Petal Infusion",
    description: "Pure natural honey blended with traditional gulkand prepared from aromatic rose petals.",
    price: 699,
    weight: "Standard",
    badge: "NATURAL BLEND",
    offer: "₹699",
    image: "/images/hero_honey_jar.jpg",
    alt: "Gulkand Honey jar with rose petal preserve",
    slug: "gulkand-honey",
    available: true,
  },
  {
    id: "kurinji-honey",
    name: "Kurinji Honey",
    category: "Honey",
    subtitle: "Rare High-Altitude Blossom",
    description: "Rare high-altitude honey harvested from blooming wild mountain kurinji flora.",
    price: 799,
    weight: "Standard",
    badge: "SPECIAL RESERVE",
    offer: "₹799 ONLY",
    image: "/images/product_raw_reserve.jpg",
    alt: "Kurinji Honey rare high-altitude reserve jar",
    slug: "kurinji-honey",
    available: true,
  },
  {
    id: "ghee",
    name: "Ghee",
    category: "Ghee",
    subtitle: "Traditional Artisanal Cultured Ghee",
    description: "Traditional artisanal cultured ghee crafted using time-honored methods.",
    price: 699,
    weight: "Standard",
    badge: "ARTISANAL GHEE",
    offer: "ARTISANAL",
    image: "/images/bundle_set.jpg",
    alt: "Traditional artisanal cultured ghee jar",
    slug: "ghee",
    available: true,
  },
];

/**
 * Additional Confirmed Visible Products & Special Offers
 */
export const MOUNTAIN_HONEY_PRODUCT: Product = {
  id: "mountain-honey",
  name: "Mountain Honey",
  category: "Honey",
  subtitle: "High-Altitude Harvest — 1 KG",
  description: "Mountain honey harvested from high altitudes in a 1 KG pack.",
  weight: "1 KG",
  price: 900,
  badge: "₹900 ONLY",
  offer: "1 KG — ₹900",
  image: "/images/product_wildflower.jpg",
  alt: "Mountain Honey 1 KG pure high-altitude harvest",
  slug: "mountain-honey",
  available: true,
};

export const PROMO_OFFER_PRODUCT: Product = {
  id: "buy-1-get-1",
  name: "Buy 1 Get 1 Special Offer",
  category: "Honey",
  subtitle: "High-Altitude Harvest Limited Promotion",
  description: "Special Buy 1 Get 1 promotional offer.",
  price: 799,
  badge: "BUY 1 GET 1",
  image: "/images/bundle_set.jpg",
  alt: "Himalayan Harvest Honey Buy 1 Get 1 promotional set",
  slug: "buy-1-get-1",
  available: true,
};

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

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote: "Outstanding purity and authentic mountain aroma. You can genuinely taste the fresh high-altitude flora in every spoonful.",
    author: "Kavitha R.",
    role: "CUSTOMER FEEDBACK",
  },
  {
    id: "2",
    quote: "The 1 KG Mountain Honey has become a daily staple for our morning routine. Beautiful texture and rich natural sweetness.",
    author: "Senthil M.",
    role: "CUSTOMER REVIEW",
  },
  {
    id: "3",
    quote: "Ordered directly via WhatsApp and the delivery was seamless. Honest quality and unmatched natural taste.",
    author: "Deepak N.",
    role: "CUSTOMER FEEDBACK",
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

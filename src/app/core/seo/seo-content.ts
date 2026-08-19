/**
 * SEO content — the single source of truth for Steph's spec
 * ("Joseph Battisti Salon — SEO Instructions & Content").
 *
 * Deliberately free of Angular imports: `scripts/generate-sitemap.ts` imports this
 * module directly under Node, which only strips types. Keep the syntax erasable
 * (no `enum`, no parameter properties) or the sitemap build breaks.
 */

export interface PageSeo {
  title: string;
  description: string;
  /** Path without the origin, e.g. '/services'. Used for canonical + og:url. */
  path: string;
}

export interface OpeningHours {
  /** schema.org DayOfWeek short form, also used as the label on the contact page. */
  day: string;
  /** 24h 'HH:MM', or null when closed. */
  opens: string | null;
  closes: string | null;
}

// ── Business (Steph §7) ──────────────────────────────────────────────────────
// Use this exact info everywhere the business is referenced. Inconsistent
// name/address/phone across pages hurts local search ranking.
export const BUSINESS = {
  name: 'Joseph Battisti Salon',
  legalName: 'Joseph Battisti Salon',
  streetAddress: '136 East 73rd St',
  addressLocality: 'New York',
  addressRegion: 'NY',
  postalCode: '10021',
  addressCountry: 'US',
  /** Human-readable, as shown on the contact page. */
  phoneDisplay: '(212) 628-5639',
  /** E.164, for schema.org and tel: links. */
  phone: '+1-212-628-5639',
  neighborhood: 'Upper East Side',
  borough: 'Manhattan',
  priceRange: '$$$',
  socials: [
    'https://www.instagram.com/officialjosephbattistisalon/',
    'https://www.facebook.com/JosephBattistiSalon/',
  ],
  logo: 'assets/svg/blackLogo.svg',
  bookingUrl: 'https://booking.mangomint.com/307273',
} as const;

/** Steph §7. Sunday/Monday closed. Consumed by both the contact page and schema.org. */
export const OPENING_HOURS: OpeningHours[] = [
  { day: 'Sunday', opens: null, closes: null },
  { day: 'Monday', opens: null, closes: null },
  { day: 'Tuesday', opens: '10:00', closes: '16:00' },
  { day: 'Wednesday', opens: '09:00', closes: '21:00' },
  { day: 'Thursday', opens: '09:00', closes: '21:00' },
  { day: 'Friday', opens: '09:00', closes: '19:00' },
  { day: 'Saturday', opens: '09:00', closes: '17:00' },
];

// ── Static pages (Steph §4) ─────────────────────────────────────────────────
export const SEO_PAGES = {
  home: {
    path: '/',
    title: 'Joseph Battisti Salon | Hair Salon Upper East Side NYC',
    description:
      "Upper East Side hair salon specializing in precision cuts, color, and extensions with Joseph Battisti's Hair Kinetics™ technique. Book online today.",
  },
  services: {
    path: '/services',
    title: 'Hair Salon Services Upper East Side | Battisti',
    description:
      "Explore Joseph Battisti Salon's full service menu on Manhattan's Upper East Side — extensions, balayage, keratin treatments, blowouts & cuts.",
  },
  shop: {
    path: '/shop',
    title: 'Shop Professional Haircare Upper East Side | Battisti',
    description:
      'Shop salon-exclusive haircare curated by Joseph Battisti — Olaplex, K18, Nutrafol & more. Ships from our Upper East Side Manhattan salon.',
  },
  contact: {
    path: '/contact',
    title: 'Contact Joseph Battisti Salon | Upper East Side NYC',
    description:
      'Visit us at 136 East 73rd St, Upper East Side NYC, or call (212) 628-5639. Book your appointment online with Joseph Battisti Salon today.',
  },
  about: {
    path: '/about',
    title: 'About Joseph Battisti | Upper East Side Master Stylist',
    description:
      'Meet Joseph Battisti — Milan-trained master stylist on Manhattan’s Upper East Side, Allure Top Stylist & creator of Hair Kinetics™.',
  },
  // Routes Steph's doc doesn't cover, written in the same voice.
  sale: {
    path: '/sale',
    title: 'Haircare Sale | Joseph Battisti Salon Upper East Side',
    description:
      'Current offers on salon-exclusive haircare at Joseph Battisti Salon, Upper East Side Manhattan. Limited quantities while stocks last.',
  },
  milbon: {
    path: '/milbon',
    title: 'Milbon Hair Products NYC | Joseph Battisti Salon',
    description:
      "Shop Milbon's Japanese professional haircare with Amino Acid Technology at Joseph Battisti Salon, Upper East Side Manhattan.",
  },
  /** Fallback while a product loads; the product page overrides it with the real title. */
  product: {
    path: '/shop',
    title: 'Shop Professional Haircare | Joseph Battisti Salon',
    description:
      'Salon-exclusive haircare curated by Joseph Battisti, shipped from our Upper East Side Manhattan salon.',
  },
  /** Fallback while a brand collection loads. */
  brand: {
    path: '/shop',
    title: 'Shop Brands We Love | Joseph Battisti Salon NYC',
    description:
      'Browse the professional haircare brands carried at Joseph Battisti Salon on Manhattan’s Upper East Side.',
  },
  notFound: {
    path: '/',
    title: 'Page Not Found | Joseph Battisti Salon',
    description: 'The page you are looking for is not available.',
  },
} as const satisfies Record<string, PageSeo>;

// ── Brand collections (Steph §6) ────────────────────────────────────────────
// `handle` is the real Shopify collection handle used by /shop/brand/:handle —
// NOT the /collections/<slug> URL in Steph's doc, which this site never had.
// Order follows her priority ranking.
export interface BrandSeo {
  handle: string;
  /** Customer-facing brand name. */
  name: string;
  title: string;
  description: string;
  /** Steph's availability note — drives whether copy leads with "where to buy". */
  availability: string;
}

export const BRAND_SEO: BrandSeo[] = [
  {
    handle: 'jon-renau',
    name: 'Jon Renau',
    title: 'Jon Renau Wigs & Hair Toppers NYC | Joseph Battisti',
    description:
      'Shop Jon Renau human and synthetic hair wigs, toppers, and hair systems at Joseph Battisti Salon, Upper East Side Manhattan.',
    availability: 'Specialty channel',
  },
  {
    handle: 'milbon',
    name: 'Milbon',
    title: 'Milbon Hair Products NYC | Joseph Battisti Salon',
    description:
      "Shop Milbon's Japanese professional haircare with Amino Acid Technology at Joseph Battisti Salon, Upper East Side Manhattan.",
    availability: 'Rare — salon-exclusive',
  },
  {
    handle: 'keratherapy',
    name: 'Keratherapy',
    title: 'Keratherapy Products NYC | Joseph Battisti Salon',
    description:
      "Shop Keratherapy's keratin-infused treatment and styling products at Joseph Battisti Salon, Upper East Side NYC.",
    availability: 'Widely available',
  },
  {
    handle: 'goldwell-dualsenses',
    name: 'Goldwell',
    title: 'Goldwell Hair Color NYC | Joseph Battisti Salon',
    description:
      'Joseph Battisti Salon colorists trust Goldwell Topchic for precision, long-lasting hair color. Book your color service on the Upper East Side.',
    availability: 'Widely available (in-salon use)',
  },
  {
    handle: 'olaplex',
    name: 'Olaplex',
    title: 'Olaplex NYC | Bond Repair Treatments | Joseph Battisti',
    description:
      'Shop Olaplex No.3, No.4, No.5 and more bond-building treatments at Joseph Battisti Salon, Upper East Side Manhattan.',
    availability: 'Widely available',
  },
  {
    handle: 'davines',
    name: 'Davines',
    title: 'Davines Hair Products NYC | Joseph Battisti Salon',
    description:
      'Shop Davines sustainable Italian haircare — Alchemic, OI & more — at Joseph Battisti Salon, Upper East Side NYC. B Corp certified formulas.',
    availability: 'Widely available',
  },
  {
    handle: 'k18',
    name: 'K18',
    title: 'K18 Hair Mask NYC | Joseph Battisti Salon',
    description:
      "Shop K18's biomimetic peptide bond-repair mask, the fastest way to reverse hair damage, at Joseph Battisti Salon, Upper East Side NYC.",
    availability: 'Widely available',
  },
  {
    handle: 'lanza',
    name: "L'Anza",
    title: "L'Anza Healing Haircare NYC | Joseph Battisti Salon",
    description:
      "Shop L'Anza's Healing haircare, including Keratin Healing Oil and Wellness CBD, at Joseph Battisti Salon, Upper East Side Manhattan.",
    availability: 'Widely available',
  },
  {
    handle: 'keracolor-clenditioner',
    name: 'Keracolor',
    title: 'Keracolor Clenditioner NYC | Joseph Battisti Salon',
    description:
      "Shop Keracolor's color-depositing Clenditioner, a semi-permanent color refresh, at Joseph Battisti Salon, Upper East Side Manhattan.",
    availability: 'Widely available',
  },
  {
    handle: 'highland-1',
    name: 'Highland',
    title: 'Highland Grooming Products NYC | Joseph Battisti',
    description:
      "Shop Highland's natural, science-backed styling products, including Glacial Cream, at Joseph Battisti Salon, Upper East Side NYC.",
    availability: 'Specialty channel',
  },
  {
    handle: 'magic-move',
    name: 'Magic Move',
    title: 'Magic Move Styling Cream NYC | Joseph Battisti',
    description:
      'Shop Supremo Magic Move Soft & Hard styling pomades for matte-finish texture at Joseph Battisti Salon, Upper East Side NYC.',
    availability: 'Rare — mostly theatrical/specialty suppliers',
  },
  {
    handle: 'buy-az',
    name: 'äz Craft Luxury Haircare',
    title: 'äz Craft Luxury Haircare NYC | Joseph Battisti',
    description:
      'Shop äz Craft Luxury Haircare, a bespoke salon-exclusive line for every hairstyle, available at Joseph Battisti Salon on the Upper East Side.',
    availability: 'Rare — salon/Nordstrom only',
  },
  {
    handle: 'alterna',
    name: 'Alterna',
    title: 'Alterna Caviar Haircare NYC | Joseph Battisti Salon',
    description:
      'Shop Alterna Caviar anti-aging haircare at Joseph Battisti Salon, Upper East Side NYC. Color-safe, luxury formulas for every hair type.',
    availability: 'Widely available',
  },
  {
    handle: 'buy-joseph-battisti-products',
    name: 'Joseph Battisti',
    title: 'Joseph Battisti Hair Products | Shop In-House Line',
    description:
      "Shop Joseph Battisti's proprietary haircare line, including the Amplify Texture Spray, formulated for the Hair Kinetics™ method.",
    availability: 'Exclusive to this salon',
  },
  {
    handle: 'nutrafol-1',
    name: 'Nutrafol',
    title: 'Nutrafol NYC | Hair Growth Supplements | Joseph Battisti',
    description:
      'Shop Nutrafol physician-formulated hair growth supplements for men and women at Joseph Battisti Salon, Upper East Side NYC.',
    availability: 'Widely available (direct-to-consumer)',
  },
  {
    handle: 'viviscal',
    name: 'Viviscal',
    title: 'Viviscal NYC | Hair Growth Supplements | Joseph Battisti',
    description:
      "Shop Viviscal's clinically studied hair growth supplements at Joseph Battisti Salon, Upper East Side NYC.",
    availability: 'Widely available',
  },
  {
    handle: 'toppik-pro-hair-fibers',
    name: 'Toppik',
    title: 'Toppik Hair Fibers NYC | Joseph Battisti Salon',
    description:
      'Shop Toppik hair building fibers, an instant fix for thinning hair, at Joseph Battisti Salon, Upper East Side Manhattan.',
    availability: 'Widely available',
  },
  {
    handle: 'style-edit',
    name: 'Style Edit',
    title: 'Style Edit Root Touch-Up NYC | Joseph Battisti',
    description:
      "Shop Style Edit's root touch-up powders, sticks and sprays for instant gray coverage at Joseph Battisti Salon, Upper East Side NYC.",
    availability: 'Widely available',
  },
  {
    handle: 'iles-formula',
    name: 'Iles Formula',
    title: 'Iles Formula Hair Care NYC | Joseph Battisti Salon',
    description:
      "Shop Iles Formula's cult-favorite Finishing Spray and repair treatments for damaged, color-treated hair at Joseph Battisti Salon, NYC.",
    availability: 'Rare — recently pulled from Sephora',
  },
  {
    handle: 'loma',
    name: 'Loma',
    title: 'Loma Organic Hair Products NYC | Joseph Battisti',
    description:
      "Shop Loma's aloe-based, sulfate-free organic haircare at Joseph Battisti Salon, Upper East Side NYC.",
    availability: 'Rare — salon-exclusive',
  },
  {
    handle: 'phyto',
    name: 'Phyto Paris',
    title: 'Phyto Paris Haircare NYC | Joseph Battisti Salon',
    description:
      "Shop Phyto's French botanical, plant-based haircare at Joseph Battisti Salon, Upper East Side NYC.",
    availability: 'Widely available',
  },
  {
    handle: 'comfortzone',
    name: 'Comfort Zone',
    title: 'Comfort Zone Skincare NYC | Joseph Battisti Salon',
    description:
      "Shop Comfort Zone's Conscious Skin Science skincare, a sustainable Italian line, at Joseph Battisti Salon, Upper East Side Manhattan.",
    availability: 'Specialty channel',
  },
];

/** Lookup used by the brand page to resolve its own metadata from the route param. */
export const BRAND_SEO_BY_HANDLE: Record<string, BrandSeo> = Object.fromEntries(
  BRAND_SEO.map((b) => [b.handle, b]),
);

/** Every route that belongs in sitemap.xml. Product URLs need a Shopify call — see plan. */
export const SITEMAP_PATHS: string[] = [
  ...[
    SEO_PAGES.home,
    SEO_PAGES.about,
    SEO_PAGES.services,
    SEO_PAGES.shop,
    SEO_PAGES.contact,
    SEO_PAGES.sale,
    SEO_PAGES.milbon,
  ].map((p) => p.path),
  // /milbon has its own route, so it is already listed above.
  ...BRAND_SEO.filter((b) => b.handle !== 'milbon').map((b) => `/shop/brand/${b.handle}`),
];

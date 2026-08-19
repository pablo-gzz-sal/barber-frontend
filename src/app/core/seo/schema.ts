import { BUSINESS, OPENING_HOURS, BrandSeo } from './seo-content';
import { SERVICE_CATEGORIES, ServiceItem } from '../../features/services-page/services.data';

/**
 * schema.org JSON-LD builders.
 *
 * Everything hangs off one `#salon` node so Google reads a single business rather than
 * a different one per page. Page-level graphs reference it by `@id` instead of
 * restating the name/address/phone — Steph §7: inconsistent NAP hurts local ranking.
 */

export type JsonLd = Record<string, unknown>;

const SCHEMA = 'https://schema.org';

export const salonId = (siteUrl: string) => `${siteUrl}/#salon`;
export const websiteId = (siteUrl: string) => `${siteUrl}/#website`;

const abs = (siteUrl: string, path: string) =>
  path.startsWith('http') ? path : `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;

/** '$95.00' -> 95, '$1,250' -> 1250, '' -> null. */
export function parsePrice(raw: string | number | null | undefined): number | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
  const cleaned = raw.replace(/[^0-9.]/g, '');
  if (!cleaned) return null;
  const value = Number.parseFloat(cleaned);
  return Number.isFinite(value) ? value : null;
}

export function stripHtml(input: string | null | undefined): string {
  return String(input ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Trim to a length Google will actually show, without cutting mid-word. */
export function truncate(input: string, max = 300): string {
  if (input.length <= max) return input;
  return `${input.slice(0, input.lastIndexOf(' ', max) || max).trimEnd()}…`;
}

const postalAddress = () => ({
  '@type': 'PostalAddress',
  streetAddress: BUSINESS.streetAddress,
  addressLocality: BUSINESS.addressLocality,
  addressRegion: BUSINESS.addressRegion,
  postalCode: BUSINESS.postalCode,
  addressCountry: BUSINESS.addressCountry,
});

const openingHoursSpecification = () =>
  OPENING_HOURS.filter((h) => h.opens && h.closes).map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: `${SCHEMA}/${h.day}`,
    opens: h.opens,
    closes: h.closes,
  }));

/**
 * The salon itself. Steph §7 lists the Manhattan flagship as the canonical address, so
 * that is the one modelled here — the Rochester and Boca Raton chairs on the contact
 * page are intentionally not separate LocalBusiness nodes.
 */
export function hairSalonSchema(siteUrl: string): JsonLd {
  return {
    '@type': ['HairSalon', 'LocalBusiness'],
    '@id': salonId(siteUrl),
    name: BUSINESS.name,
    url: `${siteUrl}/`,
    logo: abs(siteUrl, BUSINESS.logo),
    image: abs(siteUrl, BUSINESS.logo),
    telephone: BUSINESS.phone,
    priceRange: BUSINESS.priceRange,
    address: postalAddress(),
    openingHoursSpecification: openingHoursSpecification(),
    sameAs: [...BUSINESS.socials],
    areaServed: [
      { '@type': 'Place', name: `${BUSINESS.neighborhood}, ${BUSINESS.borough}` },
      { '@type': 'City', name: 'New York' },
    ],
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${BUSINESS.name}, ${BUSINESS.streetAddress}, ${BUSINESS.addressLocality}, ${BUSINESS.addressRegion} ${BUSINESS.postalCode}`,
    )}`,
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: BUSINESS.bookingUrl,
        inLanguage: 'en-US',
      },
      result: { '@type': 'Reservation', name: 'Salon appointment' },
    },
  };
}

export function websiteSchema(siteUrl: string): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': websiteId(siteUrl),
    url: `${siteUrl}/`,
    name: BUSINESS.name,
    publisher: { '@id': salonId(siteUrl) },
  };
}

/** Site-wide graph — the block that lives statically in index.html. */
export function siteGraph(siteUrl: string): JsonLd {
  return {
    '@context': SCHEMA,
    '@graph': [hairSalonSchema(siteUrl), websiteSchema(siteUrl)],
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(siteUrl: string, crumbs: Crumb[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(siteUrl, c.path),
    })),
  };
}

/**
 * `From $95.00` is a floor, not a fixed price, so it becomes a PriceSpecification with
 * minPrice rather than an Offer.price that claims exactness we don't have.
 */
function serviceOffer(siteUrl: string, item: ServiceItem): JsonLd | null {
  const price = parsePrice(item.price);
  if (price === null) return null;
  return {
    '@type': 'Offer',
    priceCurrency: 'USD',
    priceSpecification: {
      '@type': 'PriceSpecification',
      minPrice: price,
      priceCurrency: 'USD',
      valueAddedTaxIncluded: false,
    },
    availability: `${SCHEMA}/InStock`,
    url: item.bookingUrl || BUSINESS.bookingUrl,
    seller: { '@id': salonId(siteUrl) },
  };
}

/** One Service node per priced row on /services. */
export function serviceSchemas(siteUrl: string): JsonLd[] {
  return SERVICE_CATEGORIES.flatMap((category) =>
    category.services.map((item) => {
      const offer = serviceOffer(siteUrl, item);
      const node: JsonLd = {
        '@type': 'Service',
        name: item.name,
        serviceType: category.title,
        category: category.title,
        provider: { '@id': salonId(siteUrl) },
        areaServed: {
          '@type': 'Place',
          name: `${BUSINESS.neighborhood}, ${BUSINESS.borough}, New York`,
        },
      };
      if (item.description) node['description'] = item.description;
      if (offer) node['offers'] = offer;
      return node;
    }),
  );
}

/** /services — an OfferCatalog wrapping every Service, plus the breadcrumb. */
export function servicesPageSchema(siteUrl: string): JsonLd[] {
  return [
    {
      '@type': 'OfferCatalog',
      name: `${BUSINESS.name} service menu`,
      url: abs(siteUrl, '/services'),
      provider: { '@id': salonId(siteUrl) },
      itemListElement: serviceSchemas(siteUrl),
    },
    breadcrumbSchema(siteUrl, [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
    ]),
  ];
}

export interface CollectionProduct {
  id: string;
  title: string;
  price?: string;
  imageUrl?: string;
  inStock?: boolean;
}

/** /shop/brand/:handle — CollectionPage + the products it lists. */
export function brandPageSchema(
  siteUrl: string,
  brand: Pick<BrandSeo, 'handle' | 'name' | 'description'>,
  products: CollectionProduct[],
): JsonLd[] {
  const path = `/shop/brand/${brand.handle}`;
  return [
    {
      '@type': 'CollectionPage',
      '@id': `${abs(siteUrl, path)}#collection`,
      url: abs(siteUrl, path),
      name: brand.name,
      description: brand.description,
      isPartOf: { '@id': websiteId(siteUrl) },
      about: { '@type': 'Brand', name: brand.name },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: abs(siteUrl, `/product/${p.id}`),
          name: p.title,
        })),
      },
    },
    breadcrumbSchema(siteUrl, [
      { name: 'Home', path: '/' },
      { name: 'Shop', path: '/shop' },
      { name: brand.name, path },
    ]),
  ];
}

/** /shop — the brand index. */
export function shopPageSchema(siteUrl: string, brands: BrandSeo[]): JsonLd[] {
  return [
    {
      '@type': 'CollectionPage',
      '@id': `${abs(siteUrl, '/shop')}#collection`,
      url: abs(siteUrl, '/shop'),
      name: 'Shop Products We Love',
      isPartOf: { '@id': websiteId(siteUrl) },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: brands.length,
        itemListElement: brands.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: abs(siteUrl, b.handle === 'milbon' ? '/milbon' : `/shop/brand/${b.handle}`),
          name: b.name,
        })),
      },
    },
    breadcrumbSchema(siteUrl, [
      { name: 'Home', path: '/' },
      { name: 'Shop', path: '/shop' },
    ]),
  ];
}

export interface ProductSchemaInput {
  id: string;
  title: string;
  descriptionHtml?: string;
  image?: string;
  price?: string | number | null;
  vendor?: string;
  inStock?: boolean;
}

/** /product/:id */
export function productSchema(siteUrl: string, product: ProductSchemaInput): JsonLd[] {
  const path = `/product/${product.id}`;
  const price = parsePrice(product.price);
  const description = truncate(stripHtml(product.descriptionHtml));

  const node: JsonLd = {
    '@type': 'Product',
    '@id': `${abs(siteUrl, path)}#product`,
    name: product.title,
    url: abs(siteUrl, path),
  };
  if (product.image) node['image'] = product.image;
  if (description) node['description'] = description;
  if (product.vendor) node['brand'] = { '@type': 'Brand', name: product.vendor };
  if (price !== null) {
    node['offers'] = {
      '@type': 'Offer',
      price,
      priceCurrency: 'USD',
      availability: `${SCHEMA}/${product.inStock === false ? 'OutOfStock' : 'InStock'}`,
      url: abs(siteUrl, path),
      seller: { '@id': salonId(siteUrl) },
    };
  }

  return [
    node,
    breadcrumbSchema(siteUrl, [
      { name: 'Home', path: '/' },
      { name: 'Shop', path: '/shop' },
      { name: product.title, path },
    ]),
  ];
}

/** /contact */
export function contactPageSchema(siteUrl: string): JsonLd[] {
  return [
    {
      '@type': 'ContactPage',
      url: abs(siteUrl, '/contact'),
      mainEntity: { '@id': salonId(siteUrl) },
    },
    breadcrumbSchema(siteUrl, [
      { name: 'Home', path: '/' },
      { name: 'Contact', path: '/contact' },
    ]),
  ];
}

/** /about — Joseph himself, linked to the salon. */
export function aboutPageSchema(siteUrl: string): JsonLd[] {
  return [
    {
      '@type': 'AboutPage',
      url: abs(siteUrl, '/about'),
      mainEntity: {
        '@type': 'Person',
        '@id': `${siteUrl}/#joseph-battisti`,
        name: 'Joseph Battisti',
        jobTitle: 'Master Stylist',
        worksFor: { '@id': salonId(siteUrl) },
        knowsAbout: ['Hair Kinetics', 'Hair extensions', 'Balayage', 'Precision cutting'],
      },
    },
    breadcrumbSchema(siteUrl, [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
    ]),
  ];
}

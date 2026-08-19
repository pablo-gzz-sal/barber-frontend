import { BRAND_SEO, BUSINESS, OPENING_HOURS, SEO_PAGES, SITEMAP_PATHS } from './seo-content';
import { SERVICE_CATEGORIES } from '../../features/services-page/services.data';
import {
  breadcrumbSchema,
  hairSalonSchema,
  parsePrice,
  productSchema,
  serviceSchemas,
} from './schema';

const SITE = 'https://josephbattisti.com';

describe('schema builders', () => {
  it('reports the salon exactly as seo-content declares it', () => {
    const salon = hairSalonSchema(SITE) as any;

    expect(salon['@id']).toBe(`${SITE}/#salon`);
    expect(salon.name).toBe(BUSINESS.name);
    expect(salon.telephone).toBe(BUSINESS.phone);
    expect(salon.address.streetAddress).toBe(BUSINESS.streetAddress);
    expect(salon.address.postalCode).toBe(BUSINESS.postalCode);
    expect(salon.sameAs).toEqual([...BUSINESS.socials]);
  });

  it('emits an opening-hours entry only for the days the salon is open', () => {
    const open = OPENING_HOURS.filter((h) => h.opens && h.closes);
    const salon = hairSalonSchema(SITE) as any;

    expect(salon.openingHoursSpecification.length).toBe(open.length);
    expect(salon.openingHoursSpecification[0].dayOfWeek).toBe('https://schema.org/Tuesday');
  });

  it('emits one Service per priced row, looping the data rather than hand-listing it', () => {
    const rows = SERVICE_CATEGORIES.reduce((n, c) => n + c.services.length, 0);
    const services = serviceSchemas(SITE);

    expect(services.length).toBe(rows);
    expect(services.every((s) => (s as any)['@type'] === 'Service')).toBeTrue();
    expect(services.every((s) => (s as any).provider['@id'] === `${SITE}/#salon`)).toBeTrue();
  });

  it("models a 'from' price as a minPrice, not a fixed one", () => {
    const single = serviceSchemas(SITE).find((s) => (s as any).name === 'Single Process') as any;

    expect(single.offers.priceSpecification.minPrice).toBe(95);
    expect(single.offers.priceSpecification.priceCurrency).toBe('USD');
    expect(single.offers.price).toBeUndefined();
  });

  it('parses prices and rejects junk', () => {
    expect(parsePrice('$95.00')).toBe(95);
    expect(parsePrice('$1,250')).toBe(1250);
    expect(parsePrice(49.99)).toBe(49.99);
    expect(parsePrice('')).toBeNull();
    expect(parsePrice(null)).toBeNull();
  });

  it('marks a sold-out product OutOfStock', () => {
    const [node] = productSchema(SITE, {
      id: '1',
      title: 'Bond Builder',
      price: '30.00',
      inStock: false,
    }) as any[];

    expect(node.offers.availability).toBe('https://schema.org/OutOfStock');
    expect(node.offers.price).toBe(30);
  });

  it('numbers breadcrumbs from one and makes every item absolute', () => {
    const crumbs = breadcrumbSchema(SITE, [
      { name: 'Home', path: '/' },
      { name: 'Shop', path: '/shop' },
    ]) as any;

    expect(crumbs.itemListElement[0].position).toBe(1);
    expect(crumbs.itemListElement[1].item).toBe(`${SITE}/shop`);
  });
});

describe('seo content', () => {
  it('covers all 22 brand collections', () => {
    expect(BRAND_SEO.length).toBe(22);
  });

  it('has no duplicate brand handles', () => {
    const handles = BRAND_SEO.map((b) => b.handle);
    expect(new Set(handles).size).toBe(handles.length);
  });

  it('keeps titles and descriptions inside what a SERP will render', () => {
    const pages = [...Object.values(SEO_PAGES), ...BRAND_SEO];

    for (const p of pages) {
      expect(p.title.length).withContext(`title: ${p.title}`).toBeLessThanOrEqual(60);
      expect(p.description.length).withContext(`desc: ${p.title}`).toBeLessThanOrEqual(160);
    }
  });

  it('lists every brand route in the sitemap', () => {
    // milbon has its own top-level route, so it appears as /milbon rather than /shop/brand/milbon.
    for (const brand of BRAND_SEO) {
      const expected = brand.handle === 'milbon' ? '/milbon' : `/shop/brand/${brand.handle}`;
      expect(SITEMAP_PATHS).withContext(brand.name).toContain(expected);
    }
  });
});

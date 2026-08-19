import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { AboutPage } from './features/about-page/about-page';
import { ServicesPage } from './features/services-page/services-page';
import { ContactPage } from './features/contact-page/contact-page';
import { ShopPage } from './features/shop/shop-page/shop-page';
import { Checkout } from './features/checkout/checkout';
import { ProductAction } from './features/product-action/product-action';
import { BrandPage } from './features/brand-page/brand-page';
import { SalePage } from './features/sale-page/sale-page';
import { Milbon } from './features/milbon/milbon';
import { NotFound } from './features/not-found/not-found';

import { SEO_PAGES, BRAND_SEO, BRAND_SEO_BY_HANDLE } from './core/seo/seo-content';
import {
  aboutPageSchema,
  brandPageSchema,
  contactPageSchema,
  servicesPageSchema,
  shopPageSchema,
} from './core/seo/schema';
import { SeoRouteData } from './core/seo/route-seo';

/**
 * Every route carries its title/description/schema in `data.seo`; `App` applies it on
 * NavigationEnd. Pages whose content is fetched (brand, product) override this once
 * their data lands — the route entry is the correct-but-generic fallback shown in the
 * meantime, so there is never a flash of the wrong title.
 */
const seo = (data: SeoRouteData) => ({ seo: data });

export const routes: Routes = [
  { path: '', component: Home, data: seo({ page: SEO_PAGES.home }) },
  {
    path: 'about',
    component: AboutPage,
    data: seo({ page: SEO_PAGES.about, schema: aboutPageSchema }),
  },
  {
    path: 'services',
    component: ServicesPage,
    data: seo({ page: SEO_PAGES.services, schema: servicesPageSchema }),
  },
  {
    path: 'contact',
    component: ContactPage,
    data: seo({ page: SEO_PAGES.contact, schema: contactPageSchema }),
  },
  {
    path: 'shop',
    component: ShopPage,
    data: seo({ page: SEO_PAGES.shop, schema: (url) => shopPageSchema(url, BRAND_SEO) }),
  },
  {
    path: 'milbon',
    component: Milbon,
    data: seo({
      page: SEO_PAGES.milbon,
      schema: (url) =>
        brandPageSchema(url, { ...BRAND_SEO_BY_HANDLE['milbon'], handle: 'milbon' }, []),
    }),
  },
  // Transactional — useful to a shopper, worthless in an index.
  { path: 'checkout', component: Checkout, data: seo({ page: SEO_PAGES.home, noindex: true }) },
  { path: 'product/:id', component: ProductAction, data: seo({ page: SEO_PAGES.product }) },
  { path: 'shop/brand/:handle', component: BrandPage, data: seo({ page: SEO_PAGES.brand }) },
  { path: 'sale', component: SalePage, data: seo({ page: SEO_PAGES.sale }) },
  // A real 404 page rather than redirecting to home: Render answers unknown paths with
  // the SPA shell at HTTP 200, so redirecting made every typo look like a duplicate
  // homepage to crawlers.
  { path: '**', component: NotFound, data: seo({ page: SEO_PAGES.notFound, noindex: true }) },
];

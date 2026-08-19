import { RenderMode, ServerRoute } from '@angular/ssr';

import { BRAND_SEO } from './core/seo/seo-content';

/**
 * Which routes are turned into real HTML files at build time.
 *
 * Everything not listed here falls through to the `**` entry and is prerendered, which is
 * what we want: the static pages are the ones carrying Steph's copy and the structured
 * data, and they are the reason this pass exists.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'shop/brand/:handle',
    renderMode: RenderMode.Prerender,
    // The handles are already a build-time constant (they drive the sitemap and the
    // per-brand titles), so this needs no Shopify call to enumerate the collection pages.
    //
    // Milbon is excluded for the same reason the sitemap excludes it: it is not a Shopify
    // collection, it has its own /milbon route, and nothing links to /shop/brand/milbon.
    // Asking the build to render it just bakes a 404 body into a page no one visits.
    getPrerenderParams: async () =>
      BRAND_SEO.filter(({ handle }) => handle !== 'milbon').map(({ handle }) => ({ handle })),
  },

  // Client-rendered on purpose. The product catalogue lives in Shopify and changes without
  // a deploy, so a prerendered /product/:id would serve whatever was true at build time —
  // stale titles, stale prices, and missing pages for anything added since. Checkout is
  // per-user and noindex, so there is nothing to gain from rendering it early either.
  { path: 'product/:id', renderMode: RenderMode.Client },
  { path: 'checkout', renderMode: RenderMode.Client },

  { path: '**', renderMode: RenderMode.Prerender },
];

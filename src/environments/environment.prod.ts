export const environment = {
  production: true,
  name: 'PROD',
  apiUrl: 'https://headlessbackendbarber.onrender.com/v1',
  shopifyEndpoint: '/shopify',
  mangomintEndpoint: '/mangomint',
  shopifyStorefrontUrl: 'https://josephbattisti-com.myshopify.com',
  /** Origin used for canonical URLs, og:url and sitemap.xml. No trailing slash. */
  siteUrl: 'https://josephbattisti.com',
  /**
   * Live: josephbattisti.com points at this app, so the Seo service emits real robots
   * directives. This travels with the static noindex tag in src/index.html and the
   * Allow rule in public/robots.txt — all three flipped together at go-live.
   */
  siteIndexable: true,
};

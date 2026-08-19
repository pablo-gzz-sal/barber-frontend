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
   * GO-LIVE FLAG. Keep false while the app is served from barber-frontend-kura.onrender.com:
   * josephbattisti.com currently serves the old Shopify store, and two indexable copies of
   * the same salon would compete with each other. Flip to true — and swap public/robots.txt
   * to Allow — on the day the domain points here.
   */
  siteIndexable: false,
};

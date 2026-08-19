import { JsonLd } from './schema';
import { PageSeo } from './seo-content';

/** Shape of `route.data.seo`. See app.routes.ts. */
export interface SeoRouteData {
  page: PageSeo;
  /** Built lazily so it can read the runtime siteUrl. */
  schema?: (siteUrl: string) => JsonLd[];
  noindex?: boolean;
}

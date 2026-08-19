import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { environment } from '../../../environments/environment';
import { BUSINESS } from './seo-content';
import { JsonLd } from './schema';

export interface SeoInput {
  title: string;
  description: string;
  /** Path only, e.g. '/services'. Combined with environment.siteUrl for canonical + og:url. */
  path: string;
  /** Absolute URL preferred; a relative path is resolved against siteUrl. */
  image?: string;
  /** 'website' | 'article' | 'product' … */
  ogType?: string;
  /** Page-scoped JSON-LD. Replaced wholesale on every apply() — never appended. */
  jsonLd?: JsonLd[];
  /** Force noindex for this page regardless of the environment flag (404s, checkout). */
  noindex?: boolean;
}

/**
 * Marks the JSON-LD blocks this service owns.
 *
 * Everything carrying it is removed before the next page's schema is written. The
 * site-wide graph in index.html deliberately has no such attribute, so it survives
 * navigation. Without this scoping, an SPA session accumulates every page's schema and
 * each page ends up claiming to be all of them at once.
 */
const PAGE_LD_ATTR = 'data-seo';
const PAGE_LD_VALUE = 'page';

const DEFAULT_OG_IMAGE =
  'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/josephHeroCut.png?v=1773792821';

@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly doc = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  /** Origin used for canonicals and schema @ids. No trailing slash. */
  get siteOrigin(): string {
    return environment.siteUrl.replace(/\/$/, '');
  }

  /** Absolute URL for a path, for callers building schema. */
  absolute(path: string): string {
    if (/^https?:\/\//.test(path)) return path;
    return `${this.siteOrigin}${path.startsWith('/') ? path : `/${path}`}`;
  }

  apply(input: SeoInput): void {
    const url = this.absolute(input.path);
    const image = input.image ? this.absolute(input.image) : DEFAULT_OG_IMAGE;

    this.title.setTitle(input.title);
    this.meta.updateTag({ name: 'description', content: input.description });
    this.setRobots(input.noindex === true);
    this.setCanonical(url);

    this.meta.updateTag({ property: 'og:title', content: input.title });
    this.meta.updateTag({ property: 'og:description', content: input.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: input.ogType ?? 'website' });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:site_name', content: BUSINESS.name });
    this.meta.updateTag({ property: 'og:locale', content: 'en_US' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: input.title });
    this.meta.updateTag({ name: 'twitter:description', content: input.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.setJsonLd(input.jsonLd ?? []);
  }

  private setRobots(forceNoindex: boolean): void {
    // While the app lives on the Render preview URL, josephbattisti.com still serves the
    // old Shopify store — indexing both would split signal between two identical brands.
    const indexable = environment.siteIndexable && !forceNoindex;
    this.meta.updateTag({
      name: 'robots',
      content: indexable
        ? 'index, follow, max-image-preview:large, max-snippet:-1'
        : 'noindex, nofollow',
    });
  }

  private setCanonical(url: string): void {
    const head = this.doc.head;
    if (!head) return;

    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setJsonLd(blocks: JsonLd[]): void {
    const head = this.doc.head;
    if (!head) return;

    head
      .querySelectorAll(`script[type="application/ld+json"][${PAGE_LD_ATTR}="${PAGE_LD_VALUE}"]`)
      .forEach((node) => node.remove());

    if (!blocks.length) return;

    // One graph rather than N sibling scripts: keeps @id cross-references resolvable
    // and gives crawlers a single document to parse.
    const script = this.doc.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute(PAGE_LD_ATTR, PAGE_LD_VALUE);
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': blocks,
    });
    head.appendChild(script);
  }
}

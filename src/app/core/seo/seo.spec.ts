import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';

import { Seo } from './seo';

describe('Seo', () => {
  let seo: Seo;
  let doc: Document;

  const ldScripts = () =>
    Array.from(doc.head.querySelectorAll('script[type="application/ld+json"][data-seo="page"]'));
  const canonicals = () => Array.from(doc.head.querySelectorAll('link[rel="canonical"]'));

  beforeEach(() => {
    TestBed.configureTestingModule({});
    seo = TestBed.inject(Seo);
    doc = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    ldScripts().forEach((n) => n.remove());
    canonicals().forEach((n) => n.remove());
    doc.head.querySelectorAll('meta[name="description"]').forEach((n) => n.remove());
    doc.head.querySelectorAll('meta[name="robots"]').forEach((n) => n.remove());
  });

  it('sets the title and description', () => {
    seo.apply({ title: 'Services', description: 'Our menu', path: '/services' });

    expect(doc.title).toBe('Services');
    expect(doc.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'Our menu',
    );
  });

  it('builds the canonical from siteUrl and keeps exactly one of them', () => {
    seo.apply({ title: 'A', description: 'a', path: '/services' });
    seo.apply({ title: 'B', description: 'b', path: '/contact' });

    expect(canonicals().length).toBe(1);
    expect(canonicals()[0].getAttribute('href')).toBe(`${seo.siteOrigin}/contact`);
  });

  it('replaces page JSON-LD instead of appending it', () => {
    // The regression this whole data-seo scoping exists to prevent: without it an SPA
    // session accumulates every visited page's schema and each page claims to be all of them.
    seo.apply({ title: 'A', description: 'a', path: '/a', jsonLd: [{ '@type': 'AboutPage' }] });
    seo.apply({ title: 'B', description: 'b', path: '/b', jsonLd: [{ '@type': 'ContactPage' }] });
    seo.apply({
      title: 'C',
      description: 'c',
      path: '/c',
      jsonLd: [{ '@type': 'CollectionPage' }],
    });

    expect(ldScripts().length).toBe(1);

    const graph = JSON.parse(ldScripts()[0].textContent ?? '{}');
    expect(graph['@context']).toBe('https://schema.org');
    expect(graph['@graph']).toEqual([{ '@type': 'CollectionPage' }]);
  });

  it('removes page JSON-LD when a page supplies none', () => {
    seo.apply({ title: 'A', description: 'a', path: '/a', jsonLd: [{ '@type': 'AboutPage' }] });
    seo.apply({ title: 'B', description: 'b', path: '/b' });

    expect(ldScripts().length).toBe(0);
  });

  it('leaves the site-wide JSON-LD in index.html alone', () => {
    const sitewide = doc.createElement('script');
    sitewide.setAttribute('type', 'application/ld+json');
    sitewide.textContent = '{"@type":"HairSalon"}';
    doc.head.appendChild(sitewide);

    seo.apply({ title: 'A', description: 'a', path: '/a', jsonLd: [{ '@type': 'AboutPage' }] });

    expect(sitewide.isConnected).toBeTrue();
    sitewide.remove();
  });

  it('honours the per-page noindex override', () => {
    seo.apply({ title: 'Checkout', description: 'x', path: '/checkout', noindex: true });

    expect(doc.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'noindex, nofollow',
    );
  });
});

# BarberFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
yarn build
```

Use `yarn build`, not `ng build`: the script regenerates `public/sitemap.xml` from
`src/app/core/seo/seo-content.ts` first, and it has to run before the asset copy or the sitemap
lands in `dist/` one build late.

The build artifacts go to `dist/`. Two things about the output are worth knowing:

- **Every page is rendered at build time.** `outputMode: static` renders each route in Node and
  writes real HTML — `dist/services/index.html`, `dist/shop/brand/olaplex/index.html`, and so on,
  29 files in total. There is no server: the result is still a plain static site. This is what puts
  titles, meta descriptions, headings and JSON-LD in front of crawlers that do not run JavaScript.
- **`dist/index.csr.html` is the empty shell**, used for the two routes that stay client-rendered
  (`/product/:id` and `/checkout`) and for anything unmatched. See `src/app/app.routes.server.ts`.

Code that touches `window`, `document.body`, `localStorage` or `requestAnimationFrame` while a
component is being constructed or initialised must be guarded — none of it exists in Node, and an
unguarded call fails the build rather than the page. Use `IS_BROWSER` from
`src/app/core/platform.ts`, or `afterNextRender()` for anything that measures or animates. Event
handlers need no guard; nothing clicks during a build.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Deployment (Render)

The site deploys to Render as a **static site** — build command `yarn build`, publish directory
`dist`. Prerendering did not change either of those.

It does need one dashboard change. The catch-all rewrite rule must point at the shell, not at the
homepage:

| Source | Destination       | Action  |
| ------ | ----------------- | ------- |
| `/*`   | `/index.csr.html` | Rewrite |

Render skips rewrite rules for paths where a file exists, so the prerendered pages still win; the
rule only catches `/product/:id`, `/checkout` and genuine 404s. Leaving the destination as
`/index.html` would hand those URLs the prerendered **homepage** instead — same pixels once
Angular boots, but every product URL would arrive carrying the homepage's canonical tag and tell
Google it is a duplicate of the front page.

After the first deploy, confirm the prerendering actually survived hosting:

```bash
curl -s https://<host>/services | grep -o '<title>[^<]*</title>'
```

That must print the services title. If it prints the homepage title, Render is serving the rewrite
instead of `dist/services/index.html` and no page-level metadata is reaching crawlers.

## Going live

The app is deliberately not indexable while it is served from the Render preview URL —
josephbattisti.com still serves the old Shopify store, and two indexable copies of the same salon
compete with each other. Three things flip together on the day the domain points here:

1. `src/environments/environment.prod.ts` → `siteIndexable: true`
2. `public/robots.txt` → `Allow: /`, and uncomment the `Sitemap:` line
3. `src/index.html` → the static `<meta name=robots>` becomes `index, follow, …`

Flipping only one of them leaves the site blocked by the other two.

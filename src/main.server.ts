import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';

import { App } from './app/app';
import { config } from './app/app.config.server';

/**
 * Entry point for the build-time prerender pass. Nothing runs this at request time —
 * `outputMode: "static"` means every page is rendered during `yarn build` and the result
 * is deployed as plain files, so the site stays a static host with no Node process.
 *
 * The `context` argument is not optional here: on the server there is no ambient platform
 * for `bootstrapApplication` to reuse, and omitting it fails route extraction with NG0401.
 */
const bootstrap = (context: BootstrapContext) => bootstrapApplication(App, config, context);

export default bootstrap;

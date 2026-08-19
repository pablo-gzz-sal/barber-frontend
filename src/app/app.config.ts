import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withViewTransitions } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';

import { routes } from './app.routes';

/**
 * Providers shared by the browser and the prerender build.
 *
 * This file used to exist but was never wired up — `main.ts` bootstrapped with its own
 * inline provider array, so edits here silently did nothing. It now holds the real list,
 * because prerendering needs the same configuration from a second entry point
 * (`main.server.ts`) and two hand-kept copies would drift.
 *
 * `withFetch()` is required rather than optional: the prerender pass runs in Node, where
 * there is no XMLHttpRequest for HttpClient's default backend to use.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withFetch()),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    MessageService,
  ],
};

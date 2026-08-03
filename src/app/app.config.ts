import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { MessageService } from 'primeng/api';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({
  scrollPositionRestoration: 'top',
})),
    // PrimeNG's MessageService is not `providedIn: 'root'`; ToastService
    // depends on it, so declare it explicitly rather than relying on it
    // being reachable by accident.
    MessageService,
  ]
};

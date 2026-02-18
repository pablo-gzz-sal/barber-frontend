import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withViewTransitions } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { App } from './app/app';
import { routes } from './app/app.routes';
import { MessageService } from 'primeng/api';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    MessageService
  ],
}).catch((err) => console.error(err));

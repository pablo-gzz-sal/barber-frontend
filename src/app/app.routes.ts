import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { AboutPage } from './features/about-page/about-page';
import { ServicesPage } from './features/services-page/services-page';
import { ContactPage } from './features/contact-page/contact-page';

export const routes: Routes = [

    { path: '', component: Home },
    { path: 'about', component: AboutPage },
    { path: 'services', component: ServicesPage },
    { path: 'contact', component: ContactPage }
];

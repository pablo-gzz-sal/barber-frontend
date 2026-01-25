import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { AboutPage } from './features/about-page/about-page';
import { ServicesPage } from './features/services-page/services-page';
import { ContactPage } from './features/contact-page/contact-page';
import { ShopPage } from './features/shop/shop-page/shop-page';
import { AccountAuthorize } from './core/constants/account-authorize/account-authorize';
import { Account } from './core/constants/account/account';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: AboutPage },
  { path: 'services', component: ServicesPage },
  { path: 'contact', component: ContactPage },
  { path: 'shop', component: ShopPage },
  // { path: '**', redirectTo: '' },
  // {
  //   path: 'account/authorize',
  //   component: AccountAuthorize,
  // },  
  //   {
  //   path: 'account', component: Account
  // },
];

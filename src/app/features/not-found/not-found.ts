import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Header } from '../../core/components/header/header';
import { Footer } from '../../core/components/footer/footer';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [Header, Footer, RouterLink],
  templateUrl: './not-found.html',
})
export class NotFound {}

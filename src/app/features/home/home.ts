import { Component } from '@angular/core';
import { Header } from '../../core/components/header/header';
import { Hero } from './hero/hero';
import { ShopBestSellers } from '../shop/shop-best-sellers/shop-best-sellers';
import { HairKinetics } from '../kinetics/hair-kinetics/hair-kinetics';
import { TreatmentsHero } from "../treatments/treatments-hero/treatments-hero";
import { Editorial } from "../editorial/editorial/editorial";
import { ServicesGrid } from "../services/services-grid/services-grid";
import { Reviews } from "../reviews/reviews/reviews";
import { Artist } from "../about/artist/artist";
import { Salon } from "../about/salon/salon";
import { ShopSale } from "../shop/shop-sale/shop-sale";
import { Footer } from "../../core/components/footer/footer";
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Header, Hero, ShopBestSellers,
    HairKinetics, TreatmentsHero, Editorial, ServicesGrid, Reviews, Artist, Salon, ShopSale, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}

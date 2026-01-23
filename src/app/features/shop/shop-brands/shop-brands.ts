import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShopSale } from "../shop-sale/shop-sale";

export interface BrandItem {
  name: string;
  logo: string;
  link: string;
  dark?: boolean;
}

@Component({
  selector: 'app-shop-brands',
  imports: [CommonModule, RouterModule, ShopSale],
  standalone: true,
  templateUrl: './shop-brands.html',
  styleUrl: './shop-brands.css',
})
export class ShopBrands {

   brands: BrandItem[] = [
    {
      name: 'Alterna',
      logo: 'assets/svg/alterna.svg',
      link: '/shop/svg/alterna'
    },
    {
      name: 'A to Z Craft Luxury Haircare',
      logo: 'assets/svg/craftLuxury.svg',
      link: '/shop/svg/a-z',
      dark: true
    },
    {
      name: 'Joseph Battisti',
      logo: 'assets/svg/joseph-battisti.svg',
      link: '/shop/svg/joseph-battisti'
    },
    {
      name: 'Baxter of California',
      logo: 'assets/svg/baxter.svg',
      link: '/shop/svg/baxter'
    },
    {
      name: 'Comfort Zone',
      logo: 'assets/svg/comfortZone.svg',
      link: '/shop/svg/comfort-zone'
    },
    {
      name: 'Davines',
      logo: 'assets/svg/davines.svg',
      link: '/shop/svg/davines'
    },
    {
      name: 'Goldwell',
      logo: 'assets/svg/goldwell.svg',
      link: '/shop/svg/goldwell'
    },
    {
      name: 'Iles Formula',
      logo: 'assets/svg/ilesFormula.svg',
      link: '/shop/svg/iles-formula'
    },
    {
      name: 'Magic Move',
      logo: 'assets/svg/magic-move.svg',
      link: '/shop/svg/magic-move',
      dark: true
    },
    {
      name: 'Nutrafol',
      logo: 'assets/svg/nutrafol.svg',
      link: '/shop/svg/nutrafol'
    },
    {
      name: 'Olaplex',
      logo: 'assets/svg/olaplex.svg',
      link: '/shop/svg/olaplex'
    },
    {
      name: 'Phyto Paris',
      logo: 'assets/svg/phyto.svg',
      link: '/shop/svg/phyto'
    },
    {
      name: 'Style Edit',
      logo: 'assets/svg/styleEdit.svg',
      link: '/shop/svg/style-edit'
    },
    {
      name: 'Viviscal',
      logo: 'assets/svg/viviscal.svg',
      link: '/shop/svg/viviscal'
    }
  ];

}

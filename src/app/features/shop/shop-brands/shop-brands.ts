import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface BrandItem {
  name: string;
  logo: string;
  link: string;
  dark?: boolean;
  invertOnLight?: boolean; // optional
}

@Component({
  selector: 'app-shop-brands',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shop-brands.html',
})
export class ShopBrands {
  brands: BrandItem[] = [
    {
      name: 'Allure',
      logo: 'assets/svg/allure-logo.svg',
      link: '/shop/svg/allure',
      dark: true,
    },
    {
      name: 'Alterna',
      logo: 'assets/svg/alterna.svg',
      link: '/shop/svg/alterna',
    },
    {
      name: 'Baxter of California',
      logo: 'assets/svg/baxter.svg',
      link: '/shop/svg/baxter',
    },
    {
      name: 'Comfort Zone',
      logo: 'assets/svg/comfortZone.svg',
      link: '/shop/svg/comfort-zone',
    },
    {
      name: 'Craft Luxury',
      logo: 'assets/svg/craftLuxury.svg',
      link: '/shop/svg/craft-luxury',
      dark: true,
    },
    {
      name: 'Davines',
      logo: 'assets/svg/davines.svg',
      link: '/shop/svg/davines',
    },
    {
      name: 'Deer',
      logo: 'assets/svg/deer.svg',
      link: '/shop/svg/deer',
    },
    {
      name: 'Goldwell',
      logo: 'assets/svg/goldwell.svg',
      link: '/shop/svg/goldwell',
    },
    {
      name: 'Iles Formula',
      logo: 'assets/svg/ilesFormula.svg',
      link: '/shop/svg/iles-formula',
    },
    {
      name: 'Jon Renau',
      logo: 'assets/svg/jonRenau.svg',
      link: '/shop/svg/jon-renau',
    },
    {
      name: 'K18',
      logo: 'assets/svg/k18.svg',
      link: '/shop/svg/k18',
    },
    {
      name: 'KeraColor',
      logo: 'assets/svg/keraColor.svg',
      link: '/shop/svg/kera-color',
    },
    {
      name: 'KeraTherapy',
      logo: 'assets/svg/keraTeraphy.svg',
      link: '/shop/svg/kera-therapy',
    },
    {
      name: 'Lanza',
      logo: 'assets/svg/lanza.svg',
      link: '/shop/svg/lanza',
    },
    {
      name: 'Loma',
      logo: 'assets/svg/loma.svg',
      link: '/shop/svg/loma',
    },
    {
      name: 'Nutrafol',
      logo: 'assets/svg/nutrafol.svg',
      link: '/shop/svg/nutrafol',
    },
    {
      name: 'Olaplex',
      logo: 'assets/svg/olaplex.svg',
      link: '/shop/svg/olaplex',
    },
    {
      name: 'Phyto Paris',
      logo: 'assets/svg/pytho.svg', // matches your actual file name
      link: '/shop/svg/phyto',
    },
    {
      name: 'Magic Move',
      logo: 'assets/svg/magic-move.svg',
      link: '/shop/svg/magic-move',
      dark: true,
    },
    {
      name: 'Style Edit',
      logo: 'assets/svg/styleEdit.svg',
      link: '/shop/svg/style-edit',
    },
    {
      name: 'Viviscal',
      logo: 'assets/svg/viviscal.svg',
      link: '/shop/svg/viviscal',
    },
    // {
    //   name: 'White Logo',
    //   logo: 'assets/svg/whiteLogo.svg',
    //   link: '/shop/svg/white-logo',
    //   dark: true,
    // },
  ];
}

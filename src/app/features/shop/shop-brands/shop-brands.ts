import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Shopify } from '../../../core/services/shopify';

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
      link: 'allure',
      dark: true,
    },
    {
      name: 'Alterna',
      logo: 'assets/svg/alterna.svg',
      link: 'alterna',
    },
    {
      name: 'Baxter of California',
      logo: 'assets/svg/baxter.svg',
      link: 'baxter',
    },
    {
      name: 'Comfort Zone',
      logo: 'assets/svg/comfortZone.svg',
      link: 'comfort-zone',
    },
    {
      name: 'Craft Luxury',
      logo: 'assets/svg/craftLuxuryHaircare.svg',
      link: 'craft-luxury',
      dark: true,
    },
    {
      name: 'Davines',
      logo: 'assets/svg/davines.svg',
      link: 'davines',
    },
    {
      name: 'Deer',
      logo: 'assets/svg/deer.svg',
      link: 'deer',
    },
    {
      name: 'Goldwell',
      logo: 'assets/svg/goldwell.svg',
      link: 'goldwell',
    },
    {
      name: 'Iles Formula',
      logo: 'assets/svg/ilesFormula.svg',
      link: 'iles-formula',
    },
    {
      name: 'Jon Renau',
      logo: 'assets/svg/jonRenau.svg',
      link: 'jon-renau',
    },
    {
      name: 'K18',
      logo: 'assets/svg/k18.svg',
      link: 'k18',
    },
    {
      name: 'KeraColor',
      logo: 'assets/svg/keraColor.svg',
      link: 'kera-color',
    },
    {
      name: 'KeraTherapy',
      logo: 'assets/svg/keraTeraphy.svg',
      link: 'kera-therapy',
    },
    {
      name: 'Lanza',
      logo: 'assets/svg/lanza.svg',
      link: 'lanza',
    },
    {
      name: 'Loma',
      logo: 'assets/svg/loma.svg',
      link: 'loma',
    },
    {
      name: 'Nutrafol',
      logo: 'assets/svg/nutrafol.svg',
      link: 'nutrafol',
    },
    {
      name: 'Olaplex',
      logo: 'assets/svg/olaplex.svg',
      link: 'olaplex',
    },
    {
      name: 'Phyto Paris',
      logo: 'assets/svg/pytho.svg', // matches your actual file name
      link: 'phyto',
    },
    {
      name: 'Magic Move',
      logo: 'assets/svg/magic-move.svg',
      link: 'magic-move',
      dark: true,
    },
    {
      name: 'Style Edit',
      logo: 'assets/svg/styleEdit.svg',
      link: 'style-edit',
    },
    {
      name: 'Viviscal',
      logo: 'assets/svg/viviscal.svg',
      link: 'viviscal',
    },
    // {
    //   name: 'White Logo',
    //   logo: 'assets/svg/whiteLogo.svg',
    //   link: 'white-logo',
    //   dark: true,
    // },
  ];

  onBrand(link: string) {
    this.router.navigate([`/shop/brand/${link}`]);
  }

  // brands: any[] = [];

  constructor(
    private shopifyService: Shopify,
    private router: Router,
  ) {}

  // ngOnInit() {
  //   this.shopifyService.getCollections().subscribe((res: any) => {
  //     const groups = res?.brandGroups ?? [];

  //     this.brands = groups.map((g: any) => {
  //       const svgPath = this.buildBrandSvgPath(g.brandTitle);

  //       return {
  //         name: g.brandTitle,
  //         brandKey: g.brandKey,
  //         logo: svgPath,
  //         link: `/shop/brand/${g.brandKey}`,
  //         dark: ['craftluxury', 'allure', 'magicmove'].includes(
  //           this.buildBrandSvgPath(g.brandTitle),
  //         ),
  //       };
  //     });
  //   });
  // }

  // private buildBrandSvgPath(brandTitle: string): string {
  //   if (!brandTitle) return 'assets/svg/whiteLogo.svg';

  //   const normalized = brandTitle
  //     .toLowerCase()
  //     .normalize('NFD')
  //     .replace(/[\u0300-\u036f]/g, '')
  //     .replace(/['’]/g, '')
  //     .replace(/&/g, 'and')
  //     .replace(/[^a-z0-9\s]/g, ' ') // keep spaces
  //     .replace(/\s+/g, ' ')
  //     .trim();

  //   // Split into words
  //   const words = normalized.split(' ');

  //   let firstWord = words[0] ?? normalized;

  //   // 🔥 Extra smart fallback:
  //   // if no space but it starts with a known brand prefix
  //   // example: "davinesmoreinside"
  //   const knownPrefixes = [
  //     'davines',
  //     'lanza',
  //     'keracolor',
  //     'keratherapy',
  //     'olaplex',
  //     'nutrafol',
  //     'goldwell',
  //     'k18',
  //   ];

  //   for (const prefix of knownPrefixes) {
  //     if (normalized.startsWith(prefix)) {
  //       firstWord = prefix;
  //       break;
  //     }
  //   }

  //   console.log('Brand:', brandTitle, '→ SVG:', firstWord);

  //   return `assets/svg/${firstWord}.svg`;
  // }
}

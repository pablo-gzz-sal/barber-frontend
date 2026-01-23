import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

type ShopByTab = 'benefit' | 'type';

export interface ShopByItem {
  key: string;
  label: string;
  image: string;
  link: string;
}

@Component({
  selector: 'app-shop-by',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './shop-by.html',
  styleUrl: './shop-by.css',
})
export class ShopBy {

  activeTab: ShopByTab = 'benefit';

  benefitItems: ShopByItem[] = [
    {
      key: 'clarifying',
      label: 'CLARIFYING',
      image: 'assets/images/clarifyingBrand.jpg',
      link: '/products?benefit=clarifying'
    },
    {
      key: 'shine-anti-frizz',
      label: 'SHINE + ANTI FRIZZ',
      image: 'assets/images/shineBrand.jpg',
      link: '/products?benefit=shine-anti-frizz'
    },
    {
      key: 'volume',
      label: 'VOLUME',
      image: 'assets/images/volumeBrand.jpg',
      link: '/products?benefit=volume'
    },
    {
      key: 'repair-restore',
      label: 'REPAIR + RESTORE',
      image: 'assets/images/repairBrand.jpg',
      link: '/products?benefit=repair-restore'
    }
  ];

  typeItems: ShopByItem[] = [
    {
      key: 'shampoo',
      label: 'SHAMPOO',
      image: 'assets/images/shampoo.jpg',
      link: '/products?type=shampoo'
    },
    {
      key: 'conditioner',
      label: 'CONDITIONER',
      image: 'assets/images/shineBrand.jpg',
      link: '/products?type=conditioner'
    },
    {
      key: 'styling',
      label: 'STYLING',
      image: 'assets/images/styling.jpg',
      link: '/products?type=styling'
    },
    {
      key: 'treatments',
      label: 'TREATMENTS',
      image: 'assets/images/treatments.jpg',
      link: '/products?type=treatments'
    }
  ];

  trackByKey = (_: number, item: ShopByItem) => item.key;

}

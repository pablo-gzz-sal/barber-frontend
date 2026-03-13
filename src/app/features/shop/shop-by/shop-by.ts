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
      image: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/clarifyingBrand.jpg?v=1773360134',
      link: '/products?benefit=clarifying'
    },
    {
      key: 'shine-anti-frizz',
      label: 'SHINE + ANTI FRIZZ',
      image: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/shineBrand.jpg?v=1773360140',
      link: '/products?benefit=shine-anti-frizz'
    },
    {
      key: 'volume',
      label: 'VOLUME',
      image: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/volumeBrand.jpg?v=1773360123',
      link: '/products?benefit=volume'
    },
    {
      key: 'repair-restore',
      label: 'REPAIR + RESTORE',
      image: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/repairBrand.jpg?v=1773360132',
      link: '/products?benefit=repair-restore'
    }
  ];

  typeItems: ShopByItem[] = [
    {
      key: 'shampoo',
      label: 'SHAMPOO',
      image: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/productsBrand.jpg?v=1773360139',
      link: '/products?type=shampoo'
    },
    {
      key: 'conditioner',
      label: 'CONDITIONER',
      image: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/shineBrand.jpg?v=1773360140',
      link: '/products?type=conditioner'
    },
    {
      key: 'styling',
      label: 'STYLING',
      image: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/Styling.jpg?v=1773360148',
      link: '/products?type=styling'
    },
    {
      key: 'treatments',
      label: 'TREATMENTS',
      image: 'https://cdn.shopify.com/s/files/1/0573/6602/0281/files/treatmentsHero.png?v=1773360163',
      link: '/products?type=treatments'
    }
  ];

  trackByKey = (_: number, item: ShopByItem) => item.key;

}

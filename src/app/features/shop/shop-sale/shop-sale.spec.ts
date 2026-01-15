import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopSale } from './shop-sale';

describe('ShopSale', () => {
  let component: ShopSale;
  let fixture: ComponentFixture<ShopSale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopSale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopSale);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

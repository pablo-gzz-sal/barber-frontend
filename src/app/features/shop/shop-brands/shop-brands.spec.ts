import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopBrands } from './shop-brands';

describe('ShopBrands', () => {
  let component: ShopBrands;
  let fixture: ComponentFixture<ShopBrands>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopBrands]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopBrands);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

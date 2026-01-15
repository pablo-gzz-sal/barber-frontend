import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopBestSellers } from './shop-best-sellers';

describe('ShopBestSellers', () => {
  let component: ShopBestSellers;
  let fixture: ComponentFixture<ShopBestSellers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopBestSellers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopBestSellers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

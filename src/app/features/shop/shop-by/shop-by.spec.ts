import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopBy } from './shop-by';

describe('ShopBy', () => {
  let component: ShopBy;
  let fixture: ComponentFixture<ShopBy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopBy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopBy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

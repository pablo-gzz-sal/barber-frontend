import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAction } from './product-action';

describe('ProductAction', () => {
  let component: ProductAction;
  let fixture: ComponentFixture<ProductAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductAction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

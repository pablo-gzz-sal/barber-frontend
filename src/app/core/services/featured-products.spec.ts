import { TestBed } from '@angular/core/testing';

import { FeaturedProducts } from './featured-products';

describe('FeaturedProducts', () => {
  let service: FeaturedProducts;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeaturedProducts);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualSale } from './actual-sale';

describe('ActualSale', () => {
  let component: ActualSale;
  let fixture: ComponentFixture<ActualSale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualSale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualSale);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

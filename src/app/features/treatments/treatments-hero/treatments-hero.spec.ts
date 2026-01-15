import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentsHero } from './treatments-hero';

describe('TreatmentsHero', () => {
  let component: TreatmentsHero;
  let fixture: ComponentFixture<TreatmentsHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatmentsHero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatmentsHero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

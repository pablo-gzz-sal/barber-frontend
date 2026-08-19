import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ServicesGrid } from './services-grid';

describe('ServicesGrid', () => {
  let component: ServicesGrid;
  let fixture: ComponentFixture<ServicesGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesGrid],
      // Nav CTAs are real routerLinks now, so RouterLink needs an ActivatedRoute.
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicesGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

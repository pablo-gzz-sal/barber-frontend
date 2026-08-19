import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Salon } from './salon';

describe('Salon', () => {
  let component: Salon;
  let fixture: ComponentFixture<Salon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Salon],
      // Nav CTAs are real routerLinks now, so RouterLink needs an ActivatedRoute.
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Salon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

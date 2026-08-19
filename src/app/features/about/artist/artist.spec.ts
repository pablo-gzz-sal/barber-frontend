import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Artist } from './artist';

describe('Artist', () => {
  let component: Artist;
  let fixture: ComponentFixture<Artist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Artist],
      // Nav CTAs are real routerLinks now, so RouterLink needs an ActivatedRoute.
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Artist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

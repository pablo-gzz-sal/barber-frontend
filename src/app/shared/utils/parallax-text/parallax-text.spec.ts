import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParallaxText } from './parallax-text';

describe('ParallaxText', () => {
  let component: ParallaxText;
  let fixture: ComponentFixture<ParallaxText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParallaxText]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParallaxText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Salon } from './salon';

describe('Salon', () => {
  let component: Salon;
  let fixture: ComponentFixture<Salon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Salon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Salon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Milbon } from './milbon';

describe('Milbon', () => {
  let component: Milbon;
  let fixture: ComponentFixture<Milbon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Milbon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Milbon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

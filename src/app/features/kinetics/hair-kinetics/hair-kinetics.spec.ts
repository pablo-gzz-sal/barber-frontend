import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HairKinetics } from './hair-kinetics';

describe('HairKinetics', () => {
  let component: HairKinetics;
  let fixture: ComponentFixture<HairKinetics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HairKinetics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HairKinetics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editorial } from './editorial';

describe('Editorial', () => {
  let component: Editorial;
  let fixture: ComponentFixture<Editorial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editorial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editorial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

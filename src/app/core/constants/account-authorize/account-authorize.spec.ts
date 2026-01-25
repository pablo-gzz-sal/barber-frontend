import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAuthorize } from './account-authorize';

describe('AccountAuthorize', () => {
  let component: AccountAuthorize;
  let fixture: ComponentFixture<AccountAuthorize>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountAuthorize]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountAuthorize);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

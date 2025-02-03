import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAndPasswordComponent } from './email-and-password.component';

describe('EmailAndPasswordComponent', () => {
  let component: EmailAndPasswordComponent;
  let fixture: ComponentFixture<EmailAndPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailAndPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailAndPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

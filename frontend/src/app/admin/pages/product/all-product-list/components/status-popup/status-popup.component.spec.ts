import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusPopupComponent } from './status-popup.component';

describe('StatusPopupComponent', () => {
  let component: StatusPopupComponent;
  let fixture: ComponentFixture<StatusPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

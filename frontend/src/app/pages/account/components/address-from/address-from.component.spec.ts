import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressFromComponent } from './address-from.component';

describe('AddressFromComponent', () => {
  let component: AddressFromComponent;
  let fixture: ComponentFixture<AddressFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressFromComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

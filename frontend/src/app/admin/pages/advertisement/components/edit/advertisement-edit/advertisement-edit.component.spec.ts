import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementEditComponent } from './advertisement-edit.component';

describe('AdvertisementEditComponent', () => {
  let component: AdvertisementEditComponent;
  let fixture: ComponentFixture<AdvertisementEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdvertisementEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

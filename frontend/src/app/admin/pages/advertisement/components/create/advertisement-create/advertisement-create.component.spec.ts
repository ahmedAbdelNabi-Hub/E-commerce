import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementCreateComponent } from './advertisement-create.component';

describe('AdvertisementCreateComponent', () => {
  let component: AdvertisementCreateComponent;
  let fixture: ComponentFixture<AdvertisementCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdvertisementCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisementCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

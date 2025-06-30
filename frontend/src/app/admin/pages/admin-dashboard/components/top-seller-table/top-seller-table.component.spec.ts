import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSellerTableComponent } from './top-seller-table.component';

describe('TopSellerTableComponent', () => {
  let component: TopSellerTableComponent;
  let fixture: ComponentFixture<TopSellerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopSellerTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopSellerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

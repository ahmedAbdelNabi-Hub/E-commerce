import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileAttributeComponent } from './upload-file-attribute.component';

describe('UploadFileAttributeComponent', () => {
  let component: UploadFileAttributeComponent;
  let fixture: ComponentFixture<UploadFileAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadFileAttributeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadFileAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

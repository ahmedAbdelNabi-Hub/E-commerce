import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdvertisementService } from '../../../../../../core/services/advertisement.service';

@Component({
  selector: 'app-advertisement-create',
  templateUrl: './advertisement-create.component.html',
})
export class AdvertisementCreateComponent implements OnInit {
  private advService = inject(AdvertisementService);
  advertisementForm: FormGroup;
  sections = ['1', '2', '3'];
  targetPages = ['1', '2', '3'];
  directions = ['left', 'center', 'right'];
  smallImageUrl = signal<string>('');
  largeImageUrl = signal<string>('');
  constructor(private fb: FormBuilder) {
    this.advertisementForm = this.fb.group({
      largeImage: [null, Validators.required],
      smallImage: [null, Validators.required],
      title: [''],
      subtitle: [''],
      description: [''],
      linkUrl: ['', [Validators.required, Validators.pattern(/https?:\/\/.+/)]],
      section: ['', Validators.required],
      targetPage: ['', Validators.required],
      status: [false, Validators.required],
      direction: ['', Validators.required],
    });
  }

  ngOnInit(): void { }

  onSubmit() {
    if (this.advertisementForm.valid) {
      const advertisementData = this.convertToFormData();
      this.createAdvertisement(advertisementData);
      console.log('Form Submitted:', this.advertisementForm.value);
    } else {
      this.advertisementForm.markAllAsTouched();
    }
  }

  createAdvertisement(formData: FormData): void {
    this.advService.createAd(formData).subscribe(data => {
      console.log(data);
    })
  }

  onFileSelect(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      this.advertisementForm.patchValue({ [controlName]: file });
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (controlName === 'largeImage') {
          this.largeImageUrl.set(e.target.result);
        } else if (controlName === 'smallImage') {
          this.smallImageUrl.set(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  convertToFormData(): FormData {
    const formData = new FormData();
    formData.append('title', this.advertisementForm.get('title')?.value || '');
    formData.append('subtitle', this.advertisementForm.get('subtitle')?.value || '');
    formData.append('description', this.advertisementForm.get('description')?.value || '');
    formData.append('linkUrl', this.advertisementForm.get('linkUrl')?.value || '');
    formData.append('section', this.advertisementForm.get('section')?.value || '');
    formData.append('targetPage', this.advertisementForm.get('targetPage')?.value || '');
    formData.append('status', this.advertisementForm.get('status')?.value ? 'true' : 'false');
    formData.append('direction', this.advertisementForm.get('direction')?.value || '');
    const largeImageFile = this.advertisementForm.get('largeImage')?.value;
    const smallImageFile = this.advertisementForm.get('smallImage')?.value;
    if (largeImageFile) {
      formData.append('largeImage', largeImageFile);
    }
    if (smallImageFile) {
      formData.append('smallImage', smallImageFile);
    }
    return formData;
  }


}

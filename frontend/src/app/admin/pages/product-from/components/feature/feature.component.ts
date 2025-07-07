import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ProductService } from '../../../../../core/services/Product.service';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css'
})
export class FeatureComponent {
  @Input() productId!: string;

  featureForm: FormGroup;
  isSubmitting = false;
  submitMessage = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.featureForm = this.fb.group({
      features: this.fb.array([this.createFeatureFormGroup()])
    });
  }


  ngOnInit(): void {
    if (!this.productId) {
      console.error('Product ID is required');
    }
  }

  get featuresArray(): FormArray {
    return this.featureForm.get('features') as FormArray;
  }

  createFeatureFormGroup(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(800)]],
      videoUrl: [''],
      imageCoverUrl: [null, Validators.required]
    });
  }

  addFeature(): void {
    this.featuresArray.push(this.createFeatureFormGroup());
  }

  removeFeature(index: number): void {
    if (this.featuresArray.length > 1) {
      this.featuresArray.removeAt(index);
    }
  }

  onFileSelected(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.featuresArray.at(index).get('imageCoverUrl')?.setValue(file);  // ✅ Correct way
    }
  }


  onSubmit(productId: number) {
    if (this.featureForm.valid) {
      this.isSubmitting = true;
      this.submitMessage = '';
      const features = this.featuresArray.controls;
  
      let successfulSubmissions = 0;
  
      features.forEach((control, i) => {
        const feature = control.value;
  
        const formData = new FormData();
        formData.append('Title', feature.title);
        formData.append('Description', feature.description);
        formData.append('VideoUrl', feature.videoUrl || '');
  
        // ✅ Ensure it's a File
        if (feature.imageCoverUrl instanceof File) {
          formData.append('ImageCoverUrl', feature.imageCoverUrl, feature.imageCoverUrl.name);
        } else {
          console.warn('No valid file found in imageCoverUrl');
        }
  
        // Debug: Show full formData
        console.log('Submitting feature #', i + 1);
        formData.forEach((value, key) => {
          console.log(`${key}:`, value);
        });
  
        this.productService.createFeature(3068, formData).subscribe({
          next: () => {
            successfulSubmissions++;
            if (successfulSubmissions === features.length) {
              this.submitMessage = `✅ Successfully created ${successfulSubmissions} feature(s)!`;
              this.resetForm();
            }
          },
          error: (err) => {
            console.error('Error creating feature:', err);
            this.submitMessage = `❌ Error creating feature #${i + 1}: ${err.error?.title || 'Unknown error'}`;
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
      });
    } else {
      this.markAllFieldsAsTouched();
    }
  }
  

  resetForm(): void {
    this.featureForm.reset();
    while (this.featuresArray.length > 1) {
      this.featuresArray.removeAt(1);
    }
    this.featuresArray.clear();
    this.featuresArray.push(this.createFeatureFormGroup());
  }

  private markAllFieldsAsTouched(): void {
    this.featuresArray.controls.forEach(control => {
      control.markAllAsTouched();
    });
  }

  getFieldError(index: number, fieldName: string): string {
    const control = this.featuresArray.at(index).get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${fieldName} is required`;
      if (control.errors['maxlength']) return `${fieldName} is too long`;
    }
    return '';
  }
}

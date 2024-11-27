import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { map, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { ICategory } from '../../../../../../core/models/interfaces/ICategory';
import { IProductAttribute } from '../../../../../../core/models/interfaces/IProductAttribute';
import { CategoryService } from '../../../../../../core/services/Category/Category.service';
import { ProductService } from '../../../../../../core/services/Product.service';
import { ProductDataService } from '../../../../../../core/services/ProductData.service';
import { getErrorMessage } from '../../../../../../core/utils/form-error-messages';
import { strongNameValidator, strongDescriptionValidator, strongBrandValidator, positiveNumberValidator, dimensionsFormatValidator } from '../../../../../../core/validators/product-form-validators';

@Component({
  selector: 'app-add-product',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit, OnDestroy {

  productForm!: FormGroup;
  thumbnailUrls: (string | ArrayBuffer | null)[] = [];
  thumbnailFiles: (File | null)[] = []; // Array to hold thumbnail image URLs
  selectedImage: string | ArrayBuffer | null = null; // Property to hold the image URL
  categories!: ICategory[];
  productAttributes: IProductAttribute[] = [];
  productAttributesFrom !: FormGroup;
  private productDataService = inject(ProductDataService)
  private destroy$ = new Subject<void>();
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  router = inject(Router);
  errorMessage!: string | null;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initialControl();
    this.categoryService.getAllCategories().pipe(
      map(response => {
        if (response != null) {
          this.categories = response;
          console.log(response);
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }


  initialControl(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, strongNameValidator()]],
      description: ['', [Validators.required, strongDescriptionValidator()]],
      brand: ['', [Validators.required, strongBrandValidator()]],
      price: [null, [Validators.required, positiveNumberValidator()]],
      stockQuantity: [null, [Validators.required, Validators.min(1)]],
      discount: [null, [Validators.min(0),Validators.max(100)]],
      offerStartDate: [null],
      ImageFile: [null, [Validators.required]],
      weight: [null, [Validators.required, positiveNumberValidator()]],
      dimensions: [null, [Validators.required, dimensionsFormatValidator()]],
      offerEndDate: [null],  // Optional
      categoryId: [null, [Validators.required]],
      deliveryTimeInDays: [null, [Validators.required, Validators.min(1)]],  // Ensure delivery time is at least 1
      thumbnails: [[]]
    })
    this.productAttributesFrom = this.fb.group({
      attributeName: [''],
      attributeValue: ['']
    })
  }

  setImageFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const image = input.files[0];
      this.productForm.get("ImageFile")?.setValue(image);
      this.extractImageFromImageFile(image);
    }
  }

  extractImageFromImageFile(image: File) {
    const reader = new FileReader();
    reader.onload = (e) => this.selectedImage = e.target?.result ?? null; // Set preview URL
    reader.readAsDataURL(image); // Read as Data URL
  }


  addAttrubute(): void {
    if (this.productAttributesFrom.valid) {
      const attributeName = this.productAttributesFrom.get('attributeName')?.value;
      const existingAttribute = this.productAttributes.find(attr => attr.attributeName === attributeName);
      if (existingAttribute) {
        this.errorMessage = `An attribute with the name "${attributeName}" already exists.`;
        return;
      }
      else {
        const newAttribute = {
          attributeName,
          attributeValue: this.productAttributesFrom.get('attributeValue')?.value
        };
        this.productAttributes.push(newAttribute);
        this.productAttributesFrom.reset();  // Reset form after adding attribute
        this.errorMessage = null;
      }
    }
  }

  removeAttribute(index: number): void {
    this.productAttributes.splice(index, 1);  // Remove attribute from the list
  }

  clearImagePreview(): void {
    this.productForm.get('ImageFile')?.setValue(null);
    this.selectedImage = null; // Clear the preview as well
  }

  submitForm() {
    if (this.productForm.valid && this.productAttributes.length > 0) {

      // Create a new FormData object
      const formData = new FormData();

      // Append text fields from the form
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('description', this.productForm.get('description')?.value);
      formData.append('brand', this.productForm.get('brand')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('stockQuantity', this.productForm.get('stockQuantity')?.value);
      formData.append('discount', this.productForm.get('discount')?.value ?? '0'); // Default to 0 if no discount
      formData.append('weight', this.productForm.get('weight')?.value);
      formData.append('dimensions', this.productForm.get('dimensions')?.value);
      formData.append('offerStartDate', this.productForm.get('offerStartDate')?.value);
      formData.append('offerEndDate', this.productForm.get('offerEndDate')?.value);
      formData.append('categoryId', this.productForm.get('categoryId')?.value);

      // Append product attributes
      this.productAttributes.forEach((attribute, index) => {
        formData.append(`ProductAttributes[${index}].attributeName`, attribute.attributeName);
        formData.append(`ProductAttributes[${index}].attributeValue`, attribute.attributeValue);
      });

      // Append the image file if present
      const imageFile = this.productForm.get('ImageFile')?.value;
      if (imageFile) {
        formData.append('ImageFile', imageFile, imageFile.name); // Append the image with its filename
      }

      // Now submit the FormData
      this.productService.createProduct(formData).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          // Handle success response
          console.log('Product created successfully', response);
        },
        error: (error) => {
          // Handle error response
          console.error('Error creating product', error);
          this.errorMessage = 'An error occurred while creating the product. Please try again.';
        }
      });
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  isControlInvalid(controlName: string): boolean | undefined {
    const control = this.productForm.get(controlName);
    return control?.invalid && (control?.touched || control?.dirty);
  }

  getErrorMessage(controlName: string): string | null {
    return getErrorMessage(this.productForm, controlName);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { distinctUntilChanged, map, Subject, Subscription, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ICategory } from '../../../../../../core/models/interfaces/ICategory';
import { IProductAttribute } from '../../../../../../core/models/interfaces/IProductAttribute';
import { CategoryService } from '../../../../../../core/services/Category/Category.service';
import { ProductService } from '../../../../../../core/services/Product.service';
import { ProductDataService } from '../../../../../../core/services/ProductData.service';
import { getErrorMessage } from '../../../../../../core/utils/form-error-messages';
import { strongNameValidator, strongDescriptionValidator, strongBrandValidator, positiveNumberValidator, dimensionsFormatValidator } from '../../../../../../core/validators/product-form-validators';
import { IProduct } from '../../../../../../core/models/interfaces/IProduct';
import { ErrorHandlerService } from '../../../../../../core/services/ErrorHandler.service';
import { MessageService } from '../../../../../../core/services/Message.service';
import { Perform } from '../../../../../../core/models/classes/Perform';

@Component({
  selector: 'app-add-product',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private productDataService = inject(ProductDataService)
  private destroy$ = new Subject<void>();
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private messageService = inject(MessageService);
  private errorHandlerService = inject(ErrorHandlerService);
  private performApi = new Perform<ICategory[]>();
  private queryParam !: { [key: string]: string };
  private subscribetion !: Subscription;

  productForm!: FormGroup;
  thumbnailUrls: (string | ArrayBuffer | null)[] = [];
  thumbnailFiles: (File | null)[] = [];
  selectedImage: string | ArrayBuffer | null = null;
  categories!: ICategory[];
  productAttributes: IProductAttribute[] = [];
  productAttributesFrom !: FormGroup;
  router = inject(Router);
  _activeRouter = inject(ActivatedRoute);
  errorMessage!: string | null;
  params !: any;
  paramsValue !: string;

  productId !: string;
  productUpdated !: IProduct
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initialControl();
    this.getAllCategorye();
    this.getParamsFromRoute();
    if (this.productId) {
      this.getProductInMoodUpdate();
    }
  }

  getAllCategorye(): void {
    console.log("hello")
    this.performApi.load(this.categoryService.getAllCategories());
    this.performApi.data$.subscribe(response => {
      if (response) {
        this.categories = response;
      }
    })
  }
  getProductInMoodUpdate() {

    if (this.productId) {
      this.productService.getProductWithIdAndStoreInRedis(+this.productId,false).pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(data => {
        if (data) {
          this.productUpdated = data;
          this.patchValueInForm(this.productUpdated);
          console.log(data.productAttributes)
        }
      });

    }
  }
  getParamsFromRoute(): void {
    this._activeRouter.queryParams.subscribe(params => {
      this.params = params;
      if (params['update'] && params['sku']) {
        this.paramsValue = 'Update '
        this.productId = params['sku'];
      }
      else
        this.paramsValue = 'Create '
    })
  }
  initialControl(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, strongNameValidator()]],
      description: ['', [Validators.required, strongDescriptionValidator()]],
      brand: ['', [Validators.required, strongBrandValidator()]],
      price: [null, [Validators.required, positiveNumberValidator()]],
      stockQuantity: [null, [Validators.required, Validators.min(1)]],
      discount: [null, [Validators.min(0), Validators.max(100)]],
      offerStartDate: [null],
      ImageFile: [null, [Validators.required]],
      weight: [null, [Validators.required, positiveNumberValidator()]],
      dimensions: [null, [Validators.required, dimensionsFormatValidator()]],
      offerEndDate: [null],
      categoryId: [null, [Validators.required]],
      deliveryTimeInDays: [null, [Validators.required, Validators.min(1)]],
      thumbnails: [[]]

    })
    this.productAttributesFrom = this.fb.group({
      attributeName: [''],
      attributeValue: [''],
      IsFilterable: [false]
    })
  }
  patchValueInForm(product: IProduct): void {
    const offerStartDate = product.offerStartDate ? new Date(product.offerStartDate).toISOString().split('T')[0] : null;
    const offerEndDate = product.offerEndDate ? new Date(product.offerEndDate).toISOString().split('T')[0] : null;

    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      brand: product.brand,
      price: product.price,
      stockQuantity: product.stockQuantity,
      discount: product.discount,
      offerStartDate: offerStartDate,
      offerEndDate: offerEndDate,
      weight: product.weight,
      dimensions: product.dimensions,
      categoryId: product.categoryId,
      deliveryTimeInDays: product.deliveryTimeInDays,
    });

    if (product.imageUrl) {
      this.selectedImage = product.linkImage;
    }

    this.productAttributes = product.productAttributes;
  }
  setImageFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files?.length > 0) {
      const image = input.files[0];
      this.productForm.get("ImageFile")?.setValue(image);
      this.extractImageFromImageFile(image);
    }
  }
  extractImageFromImageFile(image: File) {
    const reader = new FileReader();
    reader.onload = (e) => this.selectedImage = e.target?.result ?? null;
    reader.readAsDataURL(image);
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
          id:0,
          attributeValue: this.productAttributesFrom.get('attributeValue')?.value,
          isFilterable: this.productAttributesFrom.get('IsFilterable')?.value,
          productId:0
        };
        this.productAttributes.push(newAttribute);
        console.log(this.productAttributes);
        this.productAttributesFrom.reset();
        this.errorMessage = null;
      }
    }
  }
  removeAttribute(index: number): void {
    this.productAttributes.splice(index, 1);
  }
  filterActive(index: number): void {
    if (index != null && this.productAttributes[index]) {
      this.productAttributes[index].isFilterable = true;
      this.productAttributes = [...this.productAttributes];
    }
  }
  clearImagePreview(): void {
    this.productForm.get('ImageFile')?.setValue(null);
    this.selectedImage = null;
  }
  submitForm() {
    if (this.productForm.valid && this.productAttributes?.length > 0) {
      const formData = new FormData();

      formData.append('name', this.productForm.get('name')?.value);
      formData.append('description', this.productForm.get('description')?.value);
      formData.append('brand', this.productForm.get('brand')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('stockQuantity', this.productForm.get('stockQuantity')?.value);
      formData.append('discount', this.productForm.get('discount')?.value ?? '0');
      formData.append('weight', this.productForm.get('weight')?.value);
      formData.append('dimensions', this.productForm.get('dimensions')?.value);
      formData.append('offerStartDate', this.productForm.get('offerStartDate')?.value);
      formData.append('offerEndDate', this.productForm.get('offerEndDate')?.value);
      formData.append('categoryId', this.productForm.get('categoryId')?.value);
      formData.append('deliveryTimeInDays', this.productForm.get('deliveryTimeInDays')?.value);


      this.productAttributes.forEach((attribute, index) => {
        formData.append(`ProductAttributes[${index}].attributeName`, attribute.attributeName);
        formData.append(`ProductAttributes[${index}].attributeValue`, attribute.attributeValue);
        formData.append(`ProductAttributes[${index}].IsFilterable`, attribute.isFilterable + '');
      });

      const imageFile = this.productForm.get('ImageFile')?.value;
      if (imageFile && imageFile instanceof File) {
        formData.append('ImageFile', imageFile, imageFile.name);
      }

      if (this.paramsValue.includes("Update")) {
        this.productAttributes.forEach((attribute, index) => {
          formData.append(`ProductAttributes[${index}].productId`, this.productId);
          formData.append(`ProductAttributes[${index}].id`, attribute.id+'');
        });
        this.updateProduct(this.productId, formData);
      } else if (this.paramsValue.includes("Create")) {
        this.createProduct(formData);
      }
    } else {
      this.productForm.markAllAsTouched();
      this.errorMessage = "The Attributes are Required";
    }
  }


  createProduct(formData: FormData): void {
    this.productService.createProduct(formData).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.messageService.showSuccess("Product created successfully")
      },
      error: (error) => {
        this.errorMessage = 'An error occurred while creating the product. Please try again.';
      }
    });
  }
  updateProduct(productId: string, formData: FormData): void {
    this.productService.updateProduct(productId, formData).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.messageService.showSuccess("Product Updated successfully")
      },
      error: (error) => {
        this.errorMessage = 'An error occurred while Updated the product. Please try again.';
        this.messageService.showError(this.errorMessage);
      }
    });
  }
  onImageFileChange(imageFile: File): void {
    if (imageFile) {
      this.productForm.get('ImageFile')?.setValue(imageFile);
    }
  }
  isControlInvalid(controlName: string): boolean | undefined {
    const control = this.productForm.get(controlName);
    return control?.invalid && (control?.touched || control?.dirty);
  }
  getErrorMessage(controlName: string): string | null {
    return getErrorMessage(this.productForm, controlName);
  }
  trackByAttributeName(index: number, item: IProductAttribute): string {
    return item.attributeValue;
  }
  handleProductAttributes(attributes: IProductAttribute[]): void {
    this.productAttributes = attributes;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.performApi.unsubscribe();
    this.productForm.reset();
  }

}

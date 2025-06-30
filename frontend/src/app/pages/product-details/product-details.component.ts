import { AfterViewInit, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/Product.service';
import { IProduct } from '../../core/models/interfaces/IProduct';
import { tap } from 'rxjs/operators';
import { IProductSpecParams } from '../../core/models/interfaces/IProductSpecParams';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'], // corrected styleUrls
})
export class ProductDetailsComponent implements AfterViewInit, OnInit {
  @ViewChild('detailsSection', { static: true }) detailsSection!: ElementRef;
  @ViewChild('overviewSection', { static: true }) overviewSection!: ElementRef;
  private detailsSectionOffset: number = 0;
  private overviewSectionOffset: number = 0;
  private route = inject(ActivatedRoute);
  _productService = inject(ProductService);
  detailsProduct = signal<IProduct | null>(null);
  activeSection: string = 'overview';
  productId: number=0;
  params !: IProductSpecParams;
  deliveryTimeInDays!: number;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.productId = params['sku'];
      if (this.productId) {
        this.getDetailsOfProduct(this.productId);
      }
    });
  }

  getDetailsOfProduct(id: number): void {
    this._productService.getProductWithIdAndStoreInRedis(id, true).pipe(
      tap(response => {
        this.detailsProduct.set(response);
        console.log(response)
        this.deliveryTimeInDays = response.deliveryTimeInDays;
        this._productService.clearCache();
        this.setParams();
      })
    ).subscribe();
  }

  setParams(): void {
    if (this.detailsProduct()?.categoryName != null) {
      this.params = {
        CategoryName: this.detailsProduct()?.categoryName!,
        StatusId: 0,
        PageIndex: 1,
        PageSize: 6,
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.detailsSectionOffset = this.detailsSection.nativeElement.offsetTop;
      this.overviewSectionOffset = this.overviewSection.nativeElement.offsetTop;
    }, 0);
  }

  onScroll(scrollPosition: number) {
    if (scrollPosition >= this.detailsSectionOffset && scrollPosition > this.overviewSectionOffset) {
      this.activeSection = 'details';
    } else if (scrollPosition >= this.overviewSectionOffset) {
      this.activeSection = 'overview';
    }
  }

  get deliveryDate(): string {
    const today = new Date();
    today.setDate(today.getDate() + this.deliveryTimeInDays);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    return today.toLocaleDateString('en-GB', options); 
  }

  get stockMessage(): string | null {
    if (this.detailsProduct()?.stockQuantity! <= 3 && this.detailsProduct()?.stockQuantity!> 0) {
      return `Only ${this.detailsProduct()?.stockQuantity!} left in stock – order soon.`;
    }
    return null; 
  }



  selectedColor = signal<string>('Blue');
  selectedStorage = signal<string>('128GB');
  quantity = signal<number>(1);
  selectedImage = signal<number>(0);
  showAllSpecs = signal<boolean>(false);
  isWishlisted = signal<boolean>(false);

  selectColor(color: string) {
    this.selectedColor.set(color);
  }

  selectStorage(storage: string) {
    this.selectedStorage.set(storage);
  }

  selectImage(index: number) {
    this.selectedImage.set(index);
  }

  incrementQuantity() {
    this.quantity.set(this.quantity() + 1);
  }

  decrementQuantity() {
    if (this.quantity() > 1) {
      this.quantity.set(this.quantity() - 1);
    }
  }

  toggleSpecs() {
    this.showAllSpecs.set(!this.showAllSpecs());
  }

  toggleWishlist() {
    this.isWishlisted.set(!this.isWishlisted());
  }

  addToCart() {
    console.log('Added to cart:', {
      color: this.selectedColor(),
      storage: this.selectedStorage(),
      quantity: this.quantity()
    });
  }

  buyNow() {
    console.log('Buy now:', {
      color: this.selectedColor(),
      storage: this.selectedStorage(),
      quantity: this.quantity()
    });
  }

  shareProduct() {
    if (navigator.share) {
      navigator.share({
        title: 'iPhone 13',
        text: 'Check out this iPhone 13!',
        url: window.location.href
      });
    }
  }

}

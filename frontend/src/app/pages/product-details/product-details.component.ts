import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/Product.service';
import { IProduct } from '../../core/models/interfaces/IProduct';
import { tap } from 'rxjs/operators';
import { IProductSpecParams } from '../../core/models/interfaces/IProductSpecParams';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements AfterViewInit, OnInit {
  @ViewChild('detailsSection', { static: true }) detailsSection!: ElementRef;
  @ViewChild('overviewSection', { static: true }) overviewSection!: ElementRef;

  private detailsSectionOffset: number = 0;
  private overviewSectionOffset: number = 0;

  productDescription!: SafeHtml;
  private route = inject(ActivatedRoute);
  private _productService = inject(ProductService);

  detailsProduct = signal<IProduct | any>([]);
  activeSection: string = 'overview';
  productId: number = 0;
  params!: IProductSpecParams;
  deliveryTimeInDays!: number;
  currentImage!: string;

  selectedColor = signal<string>('Blue');
  selectedStorage = signal<string>('128GB');
  quantity = signal<number>(1);
  selectedImage = signal<number>(0);
  showAllSpecs = signal<boolean>(false);
  isWishlisted = signal<boolean>(false);

  ngOnInit(): void {
    combineLatest([
      this.route.params,
      this.route.queryParams
    ]).subscribe(([params, query]) => {
      this.productId = +query['sku'] || +params['id'];
      if (this.productId) this.getDetailsOfProduct(this.productId);
    });
  }

  getDetailsOfProduct(id: number): void {
    this._productService.getProductWithIdAndStoreInRedis(id, true).pipe(
      tap(response => {
        this.detailsProduct.set(response);
        this.deliveryTimeInDays = response.deliveryTimeInDays;
        this.currentImage = response.imageUrl;
        this._productService.clearCache();
        this.setParams();
      })
    ).subscribe();
  }


  chooseImage(thumb: string, index: number): void {
    this.currentImage = 'https://localhost:7197/image/Product/thumbnails/' + thumb;
  }

  getFullImageUrl(imagePath: string): string {
    if (imagePath?.startsWith('http')) return imagePath;
    return 'https://localhost:7197/image/Product/thumbnails/' + imagePath;
  }

  getResponsiveImageSet(imagePath: string): string {
    const fullUrl = this.getFullImageUrl(imagePath);
    return `${fullUrl} 300w, ${fullUrl} 600w, ${fullUrl} 1000w`;
  }


  choiesImage(image: string): void {
    this.currentImage = image;
  }

  setParams(): void {
    const product = this.detailsProduct();
    if (product?.categoryName) {
      this.params = {
        CategoryName: product.categoryName,
        StatusId: 0,
        PageIndex: 1,
        PageSize: 6,
      };
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.detailsSectionOffset = this.detailsSection.nativeElement.offsetTop;
      this.overviewSectionOffset = this.overviewSection.nativeElement.offsetTop;
    }, 0);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollY = window.scrollY;
    if (scrollY >= this.detailsSectionOffset) {
      this.activeSection = 'details';
    } else {
      this.activeSection = 'overview';
    }
  }

  get deliveryDate(): string {
    const today = new Date();
    today.setDate(today.getDate() + this.deliveryTimeInDays);
    return today.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
    });
  }

  get stockMessage(): string | null {
    if (this.detailsProduct()?.stockQuantity! <= 3 && this.detailsProduct()?.stockQuantity! > 0) {
      return `Only ${this.detailsProduct()?.stockQuantity!} left in stock – order soon.`;
    }
    return null;
  }

  thumbUrl(imageName: string): string {
    return `https://localhost:7197/image/Product/thumbnails/${imageName}`;
  }
}

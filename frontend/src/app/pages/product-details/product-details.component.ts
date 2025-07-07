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
import { finalize, tap } from 'rxjs/operators';
import { IProductSpecParams } from '../../core/models/interfaces/IProductSpecParams';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements AfterViewInit, OnInit {
  @ViewChild('detailsSection', { static: true }) detailsSection!: ElementRef;
  @ViewChild('overviewSection', { static: true }) overviewSection!: ElementRef;
  videoUrl: SafeResourceUrl;

  private detailsSectionOffset: number = 0;
  private overviewSectionOffset: number = 0;

  productDescription!: SafeHtml;
  private route = inject(ActivatedRoute);
  _productService = inject(ProductService);

  isLoading = signal<boolean>(false);
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
  features = [
  
    {
      title: 'Powerful S Pen for Creativity & Productivity',
      description: 'You ll go hours before you need to put your device on the charger thanks to its 10,090mAh (typical) battery. This battery keeps the tablet powered for up to 13 hours, whether you re watching videos or spending a lot of time streaming. And with 45W Super Fast Charging, you ll be able to quickly restore your battery to full charge—in about 90 minutes.',
      imageCoverUrl: 'assets/eg-feature-galaxy-tab-s-492877722.webp',
      videoUrl: ''
    },
    {
      title: 'Immersive Display with 120Hz Refresh Rate',
      description: 'Experience ultra-smooth scrolling and immersive visuals with the Galaxy Tab S7’s stunning 11-inch LTPS TFT display. Whether gaming, reading, or watching movies, the 120Hz refresh rate delivers unmatched clarity and responsiveness.',
      imageCoverUrl: 'assets/eg-feature-galaxy-tab-s-492877720.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=ReU8wUzYxGg'
    },
    {
      title: 'PC-Like Performance with Samsung DeX',
      description: 'With Samsung DeX, turn your tablet into a PC-like workstation. Pair it with a keyboard and enjoy seamless multitasking, enhanced productivity, and the flexibility of working from anywhere.',
      imageCoverUrl: 'assets/eg-feature-galaxy-tab-s-492877730.jpg',
      videoUrl: ''
    }
  ];

  constructor(private sanitizer: DomSanitizer) {
    const url = 'https://www.youtube.com/embed/ReU8wUzYxGg?autoplay=1&controls=0&rel=0&modestbranding=1&mute=0';
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }


  getSafeVideoUrl(url: string): SafeResourceUrl {
    const videoId = url.split('v=')[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&rel=0&modestbranding=1&mute=0`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

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
    this.isLoading.set(true);
    this._productService.getProductWithIdAndStoreInRedis(id, true).pipe(
      tap(response => {
        this.detailsProduct.set(response);
        this.deliveryTimeInDays = response.deliveryTimeInDays;
        this.currentImage = response.imageUrl;
        this._productService.clearCache();
        this.setParams();
      }),
      finalize(() => this.isLoading.set(false))
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

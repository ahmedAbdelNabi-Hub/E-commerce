import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2, ViewChild, signal, effect } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { GroupedResultDto } from '../../../../core/models/interfaces/GroupedResultDto';
import { IProduct } from '../../../../core/models/interfaces/IProduct';
import { ProductService } from '../../../../core/services/Product.service';
import { catchError, finalize, of, Subject, takeUntil, tap } from 'rxjs';
import { Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-product-offers',
  templateUrl: './product-offers.component.html',
  styleUrls: ['./product-offers.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductOffersComponent implements OnInit, OnDestroy {
  isBrowser: boolean;
  activeIndex = signal<number>(0);
  productsGrouped = signal<GroupedResultDto<string, IProduct>[]>([]); // Signal to store products
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');

  private destroy$ = new Subject<void>();
  @ViewChild('slider', { static: false }) slider!: ElementRef;
  constructor(
    private _productService: ProductService,
    @Inject(PLATFORM_ID) platformId: object,
    private renderer: Renderer2,
    private meta: Meta
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    effect(() => {
      console.log('Products grouped updated:', this.productsGrouped());
    });
  }

  scrollToImage(index: number): void {
    this.activeIndex.set(index); // Set the active index via signal
    const sliderElement = this.slider.nativeElement;

    if (sliderElement.children.length > index) {
      const scrollAmount = sliderElement.children[index].offsetLeft;
      sliderElement.scroll({
        left: scrollAmount,
        behavior: 'smooth'
      });
    } else {

    }
  }

  ngOnInit(): void {
    this.meta.addTags([
      { name: 'description', content: 'Best products on offer!' },
      { name: 'keywords', content: 'products, offers, discounts' }
    ]);
    this.getProductsOnOfferGrouped();
  }

  getProductsOnOfferGrouped(): void {
    this._productService.getProductsOnOfferGroupedByCategory()
      .pipe(
        tap(response => {
          if (response && response.length > 0) {
            this.productsGrouped.update(currentProducts => {
              return [...currentProducts, ...response];
            });
          } else {
            this.errorMessage.set('No product offers found.');
          }
          this.loading.set(false);
        }),
        catchError(error => {
          console.error('Error fetching grouped products:', error);
          this.errorMessage.set('Unable to load product offers. Please try again later.');
          this.loading.set(false);
          return of([]);
        }),
        finalize(() => {
          this.loading.set(false);
        }),
        takeUntil(this.destroy$)
      ).subscribe();
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }


  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 1000,
    navText: ['<i class="bx bxs-chevron-left text-slate-700 text-2xl"></i>', '<i class="bx bxs-chevron-right text-slate-700 text-2xl"></i>'],
    responsive: {
      0: {
        items: 1.5
      },
      400: {
        items: 2
      },
      500: {
        items: 2.5
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false, // Navigation enabled
  }
}

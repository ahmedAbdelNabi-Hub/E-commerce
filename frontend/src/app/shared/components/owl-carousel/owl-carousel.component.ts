import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  signal,
} from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Observable, Subject, debounceTime, distinctUntilChanged, shareReplay, takeUntil } from 'rxjs';
import { IProduct } from '../../../core/models/interfaces/IProduct';
import { IProductSpecParams } from '../../../core/models/interfaces/IProductSpecParams';

@Component({
  selector: 'app-owl-carousel',
  templateUrl: './owl-carousel.component.html',
  styleUrls: ['./owl-carousel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwlCarouselComponent implements OnInit, OnChanges, OnDestroy {
  @Input() service!: any; // Generic service instance
  @Input() methodName!: string; // Name of the method to call on the service
  @Input() params!: any; // Parameters to pass to the service method
  @Input('autoPlay') autoPlay: boolean = true;
  @Input('itemLarge') itemLarge: number = 5;
  @Input('Recently') Recently: boolean = false;
  private destroy$ = new Subject<void>();
  private inProgressRequests = new Map<string, Observable<any>>();
  private cache = new Map<string, any>();
  private params$ = new Subject<any>();

  productsSignal = signal<any | null>(null); // Signal for data
  isLoadingSignal = signal<boolean>(false);
  hasErrorSignal = signal<boolean>(false);

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    autoplay: this.autoPlay,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 1000,
    navText: [
      '<i class="bx bxs-chevron-left text-slate-700 text-2xl"></i>',
      '<i class="bx bxs-chevron-right text-slate-700 text-2xl"></i>',
    ],
    responsive: {
      0: { items: 1.5 },
      400: { items: 2.3 },
      500: { items: 2.5 },
      740: { items: 4 },
      940: { items: 5 },
    },
    nav: false,
  };

  ngOnInit(): void {
    this.params$.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
      this.loadData();
    });
    if (this.params) {
      this.params$.next(this.params);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['params'] || changes['service'] || changes['methodName']) {
      this.params$.next(this.params);
    }
    if (changes['autoPlay']) {
      this.customOptions = {
        ...this.customOptions,
        autoplay: this.autoPlay,
      };
    }
    if (changes['itemLarge']) {
      this.customOptions = {
        ...this.customOptions,
        responsive: {
          0: { items: 1.5 },
          400: { items: 2.3 },
          500: { items: 2.5 },
          740: { items: 4 },
          940: { items: this.itemLarge },
        },
      };
    }
  }

  loadData(): void {
    if (!this.service || !this.methodName) {
      console.error('Service and methodName are required!');
      return;
    }

    const cacheKey = this.generateCacheKey(this.params);

    // Return cached data if available
    if (this.cache.has(cacheKey)) {
      this.productsSignal.set(this.cache.get(cacheKey));
      this.isLoadingSignal.set(false);
      this.hasErrorSignal.set(false);
      return;
    }

    // Prevent duplicate requests for the same data
    if (this.inProgressRequests.has(cacheKey)) {
      this.inProgressRequests.get(cacheKey)!.subscribe((data) => {
        this.productsSignal.set(data);
      });
      return;
    }

    this.isLoadingSignal.set(true);
    this.hasErrorSignal.set(false);

    const method = this.service[this.methodName];
    if (typeof method !== 'function') {
      console.error(`Method ${this.methodName} is not a function on the provided service.`);
      this.isLoadingSignal.set(false);
      this.hasErrorSignal.set(true);
      return;
    }

    const observable$: Observable<any> = method.call(this.service, this.params).pipe(shareReplay(1));
    this.inProgressRequests.set(cacheKey, observable$);

    observable$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.cache.set(cacheKey, data);
        this.productsSignal.set(data);
        this.isLoadingSignal.set(false);
        this.inProgressRequests.delete(cacheKey);
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.hasErrorSignal.set(true);
        this.isLoadingSignal.set(false);
        this.inProgressRequests.delete(cacheKey);
      },
    });
  }

  generateCacheKey(params: any): string {
    return JSON.stringify(params || {});
  }

  ngOnDestroy(): void {
    this.cache.clear();
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByFn(index: number, product: IProduct): number {
    return product.id;
  }
}

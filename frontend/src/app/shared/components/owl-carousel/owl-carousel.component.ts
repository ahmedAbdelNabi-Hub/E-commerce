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
import { Observable } from 'rxjs';
import { IProduct } from '../../../core/models/interfaces/IProduct';

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

  productsSignal = signal<any | null>(null); // Signal for data
  isLoadingSignal = signal<boolean>(false);
  hasErrorSignal = signal<boolean>(false);

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    autoplay:true,
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

  private cache = new Map<string, any>(); // Cache for loaded data

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['service'] || changes['methodName'] || changes['params']) {
      this.loadData();
    }
  }

  loadData(): void {
    if (!this.service || !this.methodName) {
      console.error('Service and methodName are required!');
      return;
    }

    const cacheKey = this.generateCacheKey(this.params);

    if (this.cache.has(cacheKey)) {
      const cachedData = this.cache.get(cacheKey)!;
      this.productsSignal.set(cachedData);
      this.isLoadingSignal.set(false);
      this.hasErrorSignal.set(false);
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

    const observable$: Observable<any> = method.call(this.service, this.params);

    observable$.subscribe({
      next: (data: any) => {
        this.cache.set(cacheKey, data); // Cache the data
        this.productsSignal.set(data);
        this.isLoadingSignal.set(false);
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.hasErrorSignal.set(true);
        this.isLoadingSignal.set(false);
      },
    });
  }

  generateCacheKey(params: any): string {
    return JSON.stringify(params || {});
  }

  ngOnDestroy(): void {
    this.cache.clear();
  }
  trackByFn(index: number, product: IProduct): number {
    return product.id; // Track by product ID for better performance
  }
}

 
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ProductService } from '../../core/services/Product.service';
import { catchError, delay, of, Subject, take, takeUntil, tap } from 'rxjs';
import { ProductOffersComponent } from './components/product-offers/product-offers.component';
import { CategoryCardComponent } from '../../shared/components/card/category-card/category-card.component';
import { BasketService } from '../../core/services/shipping/Basket.service';
import { StatusService } from '../../core/services/Status/status.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  productOffersComponent = ProductOffersComponent;
  categoryCardComponent = CategoryCardComponent;

  private destroy$ = new Subject<void>();
  private dataSignal = signal<any>(null);
  private _basketService = inject(BasketService);
  private basketId = localStorage.getItem('basket_id');
  constructor(public _productService: ProductService,public _productStatus:StatusService) { }

  ngOnInit(): void {
    this.fetchNewArrivals();
    this.getItemInBasket();
  }

  private fetchNewArrivals(): void {
    this._productService.getNewArrivalsProducts().pipe(
      tap(response => {
        this.dataSignal.set(response);
        console.log("the product is arrive", response)
      }),
      catchError(error => {
        console.error('Error fetching new arrivals:', error);
        return of([]);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }
  private getItemInBasket(): void {
    if (this.basketId) {
      this._basketService.getBasketByID(this.basketId)
        .pipe(
          delay(1500),
          take(1)
        ).subscribe()
    }
  }

  getNewArrivalsData() {
    return this.dataSignal();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

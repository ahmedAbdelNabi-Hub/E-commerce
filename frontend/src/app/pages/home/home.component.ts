import { ChangeDetectionStrategy, Component, inject, Inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ProductService } from '../../core/services/Product.service';
import { delay, Subject, take } from 'rxjs';
import { BasketService } from '../../core/services/shipping/Basket.service';
import { StatusService } from '../../core/services/Status/status.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class HomeComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  private dataSignal = signal<any>(null);
  private _basketService = inject(BasketService);
  private basketId = localStorage.getItem('basket_id');
  constructor(public _productService: ProductService, public _productStatus: StatusService) { }

  ngOnInit(): void {
    this.getItemInBasket();
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

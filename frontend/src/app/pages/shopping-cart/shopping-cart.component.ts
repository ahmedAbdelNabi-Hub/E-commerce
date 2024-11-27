import { Component, OnInit, OnDestroy, signal, inject, ChangeDetectionStrategy } from "@angular/core";
import { catchError, delay, Observable, of, Subject, takeUntil, tap } from "rxjs";
import { IBasket } from "../../core/models/interfaces/Basket/IBasket";
import { BasketService } from "../../core/services/shipping/Basket.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  basketItems = signal<IBasket | null>(null);
  private destroy$ = new Subject<void>();
  private _basketService = inject(BasketService);
  basketId = localStorage.getItem('basket_id');
  loadingState$: Observable<boolean> | undefined;
  private router = inject(Router);

  ngOnInit(): void {
    this.getBasket();
  }

  getBasket(): void {
    if (this.basketId) {
      this._basketService.getBasketByID(this.basketId)
        .pipe(
          tap(response => {
            this.basketItems.set(response);
          }),
          catchError(error => {
            return of([]);
          }),
          takeUntil(this.destroy$)
        ).subscribe();
    }
  }

  handleLoading(loading$: Observable<boolean>) {
    this.loadingState$ = loading$;
    this.loadingState$.pipe(
      delay(2000)
    ).subscribe()
    this.router.navigate(['']);
    this.router.navigate(['/checkout/cart']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

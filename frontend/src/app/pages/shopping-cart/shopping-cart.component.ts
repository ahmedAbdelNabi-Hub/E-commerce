import { Component, OnInit, OnDestroy, signal, inject, ChangeDetectionStrategy } from "@angular/core";
import { catchError, delay, Observable, of, Subject, takeUntil, tap } from "rxjs";
import { IBasket } from "../../core/models/interfaces/Basket/IBasket";
import { BasketService } from "../../core/services/shipping/Basket.service";
import { Router } from "@angular/router";
import { ProductService } from "../../core/services/Product.service";
import { IProduct } from "../../core/models/interfaces/IProduct";
import { IPaginationDto } from "../../core/models/interfaces/IPaginationDto";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  initalloadingFlash :boolean = false;
  basketItems = signal<IBasket | null>(null);
   productService = inject(ProductService);  
  private destroy$ = new Subject<void>();
  private _basketService = inject(BasketService);
  basketId = localStorage.getItem('basket_id');
  lastViewProduct = signal<IPaginationDto | null>(null);  
  loadingState$: Observable<boolean> | undefined;
  private router = inject(Router);

  ngOnInit(): void {
    this.getBasket();
    this.getResentlyProducts()  ;
  }

  getBasket(): void {
    if (this.basketId) {
      this._basketService.getBasketByID(this.basketId)
        .pipe(
          tap(response => {
            this.basketItems.set(response);
            if(this.basketItems()?.basketItems.length === 0){ 
              this.initalloadingFlash = false;  
            }
            else{
              this.initalloadingFlash = true; 
            }
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
    ).subscribe(Response => {
      this.getBasket();
    })
  }
  getResentlyProducts() {
    this.productService.GetRecentlyProducts().subscribe(response=>{
       this.lastViewProduct.set(response);  
    });  
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

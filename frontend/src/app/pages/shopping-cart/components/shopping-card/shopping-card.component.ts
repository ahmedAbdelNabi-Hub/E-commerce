import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IBasketItem } from '../../../../core/models/interfaces/Basket/IBasketItem';
import { BasketService } from '../../../../core/services/shipping/Basket.service';
import { Perform } from '../../../../core/models/classes/Perform';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { MessageService } from '../../../../core/services/Message.service';

@Component({
  selector: 'app-shopping-card',
  templateUrl: './shopping-card.component.html',
  styleUrl: './shopping-card.component.css',
})
export class ShoppingCardComponent implements OnDestroy, AfterViewInit {
  @Input('BasketItem') basketItem !: IBasketItem;
  @Output() isLoading = new EventEmitter<Observable<boolean>>();
  private _basketService = inject(BasketService);
  readonly _preFrom = new Perform();
  private router = inject(Router);
  private messageService = inject(MessageService);

  selectQantity: number = 1;
  stockOptions: number[] = [];

  ngAfterViewInit(): void {
    this.stockOptions = this.generateStockOptions(this.basketItem.unitOfStock);
  }

  generateStockOptions(unitOfStock: number): number[] {
    return Array.from({ length: unitOfStock }, (_, i) => i + 1);
  }

  updateQuantity(NewQuantity: number): void {
    this._preFrom.load(this._basketService.updateBasketItemQuantity(this.basketItem, NewQuantity))
    this.isLoading.emit(this._preFrom.isLoading$);
  }

  deleteItemFromBasket(item: IBasketItem) {
    this._preFrom.load(this._basketService.deleteItemFromBasket(item).pipe(tap((data) => {
      if (data) {
        this.messageService.showSuccess("The Item Deleted Successfully");
      }}))
    );
    this.isLoading.emit(this._preFrom.isLoading$)
  }

  ngOnDestroy(): void {
    this._preFrom.unsubscribe();
  }
}

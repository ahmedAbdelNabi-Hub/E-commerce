import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { IProduct } from '../../../../core/models/interfaces/IProduct';
import { BasketService } from '../../../../core/services/shipping/Basket.service';
import { IBasket } from '../../../../core/models/interfaces/Basket/IBasket';
import { Perform } from '../../../../core/models/classes/Perform';
import { Router } from '@angular/router';
import { MessageService } from '../../../../core/services/Message.service';
import { delay, tap } from 'rxjs';

@Component({
  selector: 'app-product-card-with-discound',
  templateUrl: './product-card-with-discound.component.html',
  styleUrl: './product-card-with-discound.component.css'
})
export class ProductCardWithDiscoundComponent implements OnDestroy {
  @Input('productData') productData !: IProduct | any;
  @Input('showWithRow') Row: boolean = false;
  @Input('EnableForProductsPage') EnableForProductsPage: boolean = false;
  private router = inject(Router);
  _basketService = inject(BasketService);
  perform = new Perform<IBasket | null>();
  private messageService = inject(MessageService);
  @Input('Recently') Recently: boolean = false;
  navigateToProduct(productData: any) {
    this.router.navigate(
      ['/product', productData.categoryName, productData.nameEn],
      { state: { id: productData.id } }
    );
  }

  addToBasket(product: IProduct) {
    const addItem$ = this._basketService.addItemInBasket(product);
    this.perform.load(addItem$.pipe(delay(1000), tap(data => {
      if (data) {
        this.messageService.showSuccess("Item added! Continue shopping or proceed to checkout");
      }
    })));
  }

  ngOnDestroy(): void {
    this.perform.unsubscribe();
  }
}

import { Component, inject, Input, OnInit } from '@angular/core';
import { IProduct } from '../../../../core/models/interfaces/IProduct';
import { BasketService } from '../../../../core/services/shipping/Basket.service';
import { IBasket } from '../../../../core/models/interfaces/Basket/IBasket';
import { Perform } from '../../../../core/models/classes/Perform';
import { Router } from '@angular/router';
import { MessageService } from '../../../../core/services/Message.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-product-card-with-discound',
  templateUrl: './product-card-with-discound.component.html',
  styleUrl: './product-card-with-discound.component.css'
})
export class ProductCardWithDiscoundComponent {
  @Input('productData') productData !: IProduct
  @Input('showWithRow') Row: boolean = false;
  private router = inject(Router);
  _basketService = inject(BasketService);
  perform = new Perform<IBasket | null>();
  private messageService = inject(MessageService);
  @Input('Recently') Recently :boolean=false;
  navigateToProduct(productData: any) {
    this.router.navigate(
      ['/product', productData.categoryName, productData.nameEn],
      { state: { id: productData.id } }
    );
  }

  addToBasket(product: IProduct) {
    const addItem$ = this._basketService.addItemInBasket(product);
    this.perform.load(addItem$.pipe(delay(1000)));
      this.messageService.showSuccess("The Item Added in Cart Shopping");
  }
}

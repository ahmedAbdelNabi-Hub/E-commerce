import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartRoutingModule } from './shopping-cart-routing.module';
import { ShoppingCartComponent } from '../../../pages/shopping-cart/shopping-cart.component';
import { SharedModule } from '../../../shared/shared.module';
import { OrderTotalComponent } from '../../../pages/shopping-cart/components/order-total/order-total.component';
import { FormsModule } from '@angular/forms';
import { ShoppingCardComponent } from '../../../pages/shopping-cart/components/shopping-card/shopping-card.component';


@NgModule({
  declarations: [
    ShoppingCartComponent,
    ShoppingCardComponent,
    OrderTotalComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ShoppingCartRoutingModule
  ]
})
export class ShoppingCartModule { }

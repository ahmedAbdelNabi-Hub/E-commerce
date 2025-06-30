import { Component, Input, computed, inject, signal } from '@angular/core';
import { IBasket } from '../../../../core/models/interfaces/Basket/IBasket';
import { OrderService } from '../../../../core/services/order.service';
import { Router } from '@angular/router';
import { delay, tap } from 'rxjs';

@Component({
  selector: 'app-order-total',
  templateUrl: './order-total.component.html',
  styleUrls: ['./order-total.component.css'],
})
export class OrderTotalComponent {
  @Input() basketItems = signal<IBasket | null>(null);
  private _orderService = inject(OrderService);
  private _router = inject(Router);
  subtotal = computed(() => {
    return this.basketItems()?.basketItems.reduce((total: number, item: { subTotal: number; }) => total + item.subTotal, 0) ?? 0;
  });

  shippingCost = computed(() => (this.subtotal() > 500 ? 0 : 50));
  estimatedTax = computed(() => this.subtotal() * 0.0007);
  total = computed(() => this.subtotal() + this.shippingCost() + this.estimatedTax());
  Isloading: boolean = false;


  _checkout(): void {
    this.Isloading = true
    this._orderService.simulateDelay().subscribe(res => {
      this.Isloading = false;
      this._orderService.cachecheckoutPrice({
        subtotal: this.subtotal(),
        total: this.total(),
        tax  : this.estimatedTax()
      })
      this._router.navigate(['checkout/s'])
    })
  }

}

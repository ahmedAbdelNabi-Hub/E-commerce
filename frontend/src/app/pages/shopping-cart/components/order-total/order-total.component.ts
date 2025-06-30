import { Component, Input, computed, inject, signal } from '@angular/core';
import { IBasket } from '../../../../core/models/interfaces/Basket/IBasket';
import { OrderService } from '../../../../core/services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-total',
  templateUrl: './order-total.component.html',
  styleUrls: ['./order-total.component.css'],
})
export class OrderTotalComponent {
  private _orderService = inject(OrderService);
  private _router = inject(Router);

  // Signal for internal state
  private _basketItems = signal<IBasket | null>(null);

  // Accept input from parent
  @Input() set basketItems(value: IBasket | null) {
    console.log('Received basket:', value);
    this._basketItems.set(value);
  }

  get basketItems() {
    return this._basketItems();
  }

  // Calculate subtotal based on offerPrice * quantity
  subtotal = computed(() =>
    this.basketItems?.basketItems.reduce((total, item) => total + (item.offerPrice! * item.quantity), 0) ?? 0
  );

  shippingCost = computed(() => (this.subtotal() > 500 ? 0 : 50));

  estimatedTax = computed(() => parseFloat((this.subtotal() * 0.0007).toFixed(2)));

  total = computed(() =>
    parseFloat((this.subtotal() + this.shippingCost() + this.estimatedTax()).toFixed(2))
  );

  Isloading = false;

  _checkout(): void {
    this.Isloading = true;
    this._orderService.simulateDelay().subscribe(() => {
      this.Isloading = false;
      this._orderService.cachecheckoutPrice({
        subtotal: this.subtotal(),
        total: this.total(),
        tax: this.estimatedTax(),
      });
      this._router.navigate(['checkout/s']);
    });
  }
}

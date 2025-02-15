import { Component, Input, computed, signal } from '@angular/core';
import { IBasket } from '../../../../core/models/interfaces/Basket/IBasket';

@Component({
  selector: 'app-order-total',
  templateUrl: './order-total.component.html',
  styleUrls: ['./order-total.component.css'],
})
export class OrderTotalComponent {
  @Input() basketItems = signal<IBasket | null>(null);

  // Compute subtotal dynamically
  subtotal = computed(() => {
    return this.basketItems()?.basketItems.reduce((total: any, item: { subTotal: any; }) => total + item.subTotal, 0) ?? 0;
  });

  shippingCost = computed(() => (this.subtotal() > 500 ? 0 : 50)); // Free shipping over 500
  estimatedTax = computed(() => this.subtotal() * 0.0007); // 14% tax
  total = computed(() => this.subtotal() + this.shippingCost() + this.estimatedTax());
}

import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { OrderService } from '../../../../core/services/order.service';
import { Perform } from '../../../../core/models/classes/Perform';
import { IOrder } from '../../../../core/models/interfaces/IOrder';
import { tap } from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit, OnDestroy {
  private _orderService = inject(OrderService);
  private _OrderApi = new Perform<IOrder[]>();
  orders = signal<IOrder[]>([]);

  ngOnInit(): void {
    this.getOrdersByUserEmail();
  }
  getOrdersByUserEmail(): void {
    this._OrderApi.load(this._orderService.getOrdersByEmailUser());
    this._OrderApi.data$.pipe(
      tap(response => {
        if (response) {
          this.orders.set(response);
        }
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this._OrderApi.unsubscribe();
  }

}

import { Component, inject, Input, OnInit } from '@angular/core';
import { IOrder } from '../../../../core/models/interfaces/IOrder';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.css'
})
export class OrderCardComponent implements OnInit {
  @Input("orderData") orderData !: IOrder
  showModal = false;
  ngOnInit(): void {
    console.log(this.orderData);
  }
}

import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { IPaginationDto } from '../../../core/models/interfaces/IPaginationDto';
import { catchError, take, tap, throwError } from 'rxjs';
import { IOrder } from '../../../core/models/interfaces/IOrder';
import { Perform } from '../../../core/models/classes/Perform';
import { IBaseApiResponse } from '../../../core/models/interfaces/IBaseApiResponse';
import { MessageService } from '../../../core/services/Message.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderComponent implements OnInit, OnDestroy {
  orderService = inject(OrderService);
  orderApi = new Perform<IPaginationDto  | null>();
  updateOrderStatusApi = new Perform<IBaseApiResponse | null>();
  orders = signal<IOrder[] | null>(null);
  statusOrder: string = '';
  activeDropdown: string | null = null;

  private MessageHandler = inject(MessageService);

  ngOnInit(): void {
    this.getAllOrdersByStatus('', '1', '10');
  }

  getAllOrdersByStatus(status: string, pageIndex: string, pageSize: string): void {
    this.orderApi.load(this.orderService.getOrdersByStatus(status, pageIndex, pageSize));

    this.orderApi.data$.pipe(
      tap(response => {
        console.log('API Response:', response); // ✅ Debugging
        if (response && 'data' in response) {
          this.orders.set(response.data as IOrder[]);
        }
      })
    ).subscribe();
  }

  setStatusOrder(status: string): void {
    this.statusOrder = status;
    this.getAllOrdersByStatus(this.statusOrder, '1', '10');
  }

  updateOrderStatus(orderId: number, status: string): void {
    this.updateOrderStatusApi.load(
      this.orderService.updateOrderStatus(orderId, status).pipe(
        tap(data => {
          this.MessageHandler.showSuccess(data?.message!);
          this.getAllOrdersByStatus(this.statusOrder, '1', '10');
        }),
        catchError((error: any) => {
          console.error('Error:', error); 
          this.MessageHandler.showError(error.error?.message || "An error occurred.");
          return throwError(() => error); 
        })
      )
    ); 
  }
  
  setActiveDropdown(dropdownId: string): void {
    this.activeDropdown = this.activeDropdown === dropdownId ? null : dropdownId;
  }

  ngOnDestroy(): void {
    this.orderApi.unsubscribe();
  }

}

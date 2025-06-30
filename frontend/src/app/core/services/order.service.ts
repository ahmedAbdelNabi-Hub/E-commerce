import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import { IDeliveryMethod } from '../models/interfaces/IDeliveryMethod';
import { API_URLS } from '../constant/api-urls';
import { IOrderParams } from '../models/interfaces/IOrderParams';
import { ICheckoutPrice } from '../models/interfaces/ICheckoutPrice';
import { IOrder } from '../models/interfaces/IOrder';
import { IOrderResponse } from '../models/interfaces/IOrderResponse';
import { IPaginationDto } from '../models/interfaces/IPaginationDto';
import { IBaseApiResponse } from '../models/interfaces/IBaseApiResponse';

@Injectable({ providedIn: 'root' })
export class OrderService {

    private _orderParams = new BehaviorSubject<IOrderParams | null>(null);
    private _checkoutPrice = new BehaviorSubject<ICheckoutPrice | null>(null)
    checkoutPrice$ = this._checkoutPrice.asObservable();
    orderParams$ = this._orderParams.asObservable();

    private _http = inject(HttpClient);
    getAllDeliveryMethod(): Observable<IDeliveryMethod[]> {
        return this._http.get<IDeliveryMethod[]>(`${API_URLS.Localhost}/api/deliveryMethods`);
    }
    cacheOrderParams(params: IOrderParams): void {
        this._orderParams.next(params);
    }
    cachecheckoutPrice(params: ICheckoutPrice): void {
        this._checkoutPrice.next(params);
    }
    getCheckoutPrice(): ICheckoutPrice | null {
        return this._checkoutPrice.value;
    }

    updateOrderStatus(orderId: number, status: string): Observable<IBaseApiResponse> {
        return this._http.patch<IBaseApiResponse>(`${API_URLS.Localhost}/api/orders/${orderId}/status/${status}`, {});
    }

    createOrder(params: IOrderParams): Observable<IOrderResponse> {

        return this._http.post<IOrderResponse>(`${API_URLS.Localhost}/api/order/create`, this.getOrderParams())
    }
    getOrdersByEmailUser(): Observable<IOrder[]> {
        return this._http.get<IOrder[]>(`${API_URLS.Localhost}/api/orders/by-email`);
    }

    getOrderParams(): IOrderParams | null {
        return this._orderParams.value;
    }

    getOrdersByStatus(status: string, pageIndex: string, pageSize: string): Observable<IPaginationDto> {
        return this._http.get<IPaginationDto>(`${API_URLS.Localhost}/api/orders?status=${status}&pageIndex=${pageIndex}&pageSize=${pageSize}`)
    }
    simulateDelay(): Observable<void> {
        return of(undefined).pipe(delay(2000));
    }
}
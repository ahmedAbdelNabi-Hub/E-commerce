import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { Perform } from '../../core/models/classes/Perform';
import { IDeliveryMethod } from '../../core/models/interfaces/IDeliveryMethod';
import { Subject } from 'rxjs';
import { AddressService } from '../../core/services/address.service';
import { IAddress } from '../../core/models/interfaces/IAddress';
import { Router } from '@angular/router';
import { BasketService } from '../../core/services/shipping/Basket.service';
import { MessageService } from '../../core/services/Message.service';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent implements OnInit, OnDestroy {
  paymentMethods = [
    { id: 'CreditCard', name: 'Credit Card', description: 'Pay with your credit card' },
    { id: 'Paypal', name: 'Paypal account', description: 'Connect to your account' },
    { id: 'COD', name: 'Cash on Delivery', description: 'Payment on delivery' }
  ];

  deliveryMethods = signal<IDeliveryMethod[] | null>(null);
  addresses = signal<IAddress[] | null>(null);
  selectedDeliveryMethod: IDeliveryMethod | null = null;
  selectedPaymentMethod = signal<any | null>(null);
  selectedAddress = signal<IAddress | null>(null);
  products = signal<any[] | null>(null);
  isLoading = signal<boolean>(false);
  messageErrorAddress = '';
  orderService = inject(OrderService);
  addressApi = new Perform<IAddress[]>();

  private destroy$ = new Subject<void>();
  private addressService = inject(AddressService);
  private basketService = inject(BasketService);
  private toastService = inject(MessageService);
  private deliveryMethodApi = new Perform<IDeliveryMethod[]>();
  private basketId = localStorage.getItem("basket_id");

  ngOnInit(): void {
    this.loadDeliveryMethods();
    this.loadAddresses();
    this.setDefaultPaymentMethod();
    this.loadBasketItems();
    this.cacheOrderParams();
  }

  private setDefaultPaymentMethod(): void {
    const defaultPayment = this.paymentMethods.find(m => m.id === 'COD');
    if (defaultPayment) {
      this.selectedPaymentMethod.set(defaultPayment);
    }
  }

  private loadBasketItems(): void {
    if (!this.basketId) return;

    const items = this.basketService.getCurrentBasket();
    if (!items?.basketItems?.length) {
      this.basketService.getBasketByID(this.basketId).pipe(
        takeUntil(this.destroy$),
        tap(resp => this.products.set(resp?.basketItems ?? []))
      ).subscribe();
    } else {
      this.products.set(items.basketItems);
    }
  }

  chooseDeliveryMethod(deliveryMethod: IDeliveryMethod): void {
    this.selectedDeliveryMethod = deliveryMethod;
    this.cacheOrderParams();
  }

  placeOrder(): void {
    const params = this.orderService.getOrderParams();
    if (!params) return;
    this.isLoading.set(true);
    this.orderService.createOrder(params).pipe(
      takeUntil(this.destroy$),
      tap(response => {
        this.isLoading.set(false);
        if (response.checkoutUrl) {
          window.location.href = response.checkoutUrl; // 🔹 Redirect to Stripe
        } else {
          this.toastService.showSuccess(response.message); // 🔹 Show success message
        }
      })
    ).subscribe({
      error: (error) => {
        this.isLoading.set(false);
        console.error("Order creation failed", error);
        this.toastService.showError("Failed to create order");
      }
    });
  }

  selectAddress(address: IAddress): void {
    this.selectedAddress.set(address);
    this.messageErrorAddress = '';
    this.cacheOrderParams();

  }

  choosePaymentMethod(paymentMethod: any): void {
    this.selectedPaymentMethod.set(paymentMethod);
    this.cacheOrderParams();

  }

  private loadDeliveryMethods(): void {
    this.deliveryMethodApi.load(this.orderService.getAllDeliveryMethod());
    this.deliveryMethodApi.data$.pipe(
      takeUntil(this.destroy$),
      tap(response => {
        if (!response) return;

        this.deliveryMethods.set(response);
        const defaultMethod = response.find(m => m.description === "Free Shipping (Available for Cairo & Giza)");
        if (defaultMethod) {
          this.selectedDeliveryMethod = defaultMethod;
        }
      })
    ).subscribe();
  }

  private loadAddresses(): void {
    if (this.addresses()) return; // Prevent redundant API calls

    this.addressApi.load(this.addressService.getAddress());
    this.addressApi.data$.pipe(
      takeUntil(this.destroy$),
      tap(response => {
        if (response) {
          this.addresses.set(response);
        }
      })
    ).subscribe();
  }

  cacheOrderParams(): void {
    if (!this.selectedAddress()) {
      this.messageErrorAddress = "Please select an address before proceeding.";
      return;
    }
      this.orderService.cacheOrderParams({
        basketId: this.basketId!,
        shippingAddress: this.selectedAddress()!,
        deliveryMethodId: this.selectedDeliveryMethod?.id ?? 0,
        paymentMethod: this.selectedPaymentMethod()?.id
      });
  }

  ngOnDestroy(): void {
    this.deliveryMethodApi.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}

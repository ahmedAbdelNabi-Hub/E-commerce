import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { IBasket } from '../../models/interfaces/Basket/IBasket';
import { HttpClient } from '@angular/common/http';
import { API_URLS } from '../../constant/api-urls';
import { IBasketItem } from '../../models/interfaces/Basket/IBasketItem';
import { IProduct } from '../../models/interfaces/IProduct';
import { Basket } from '../../models/classes/Basket';

@Injectable({ providedIn: 'root' })
export class BasketService {
    private readonly _http = inject(HttpClient);
    private readonly _basketSource = new BehaviorSubject<IBasket | null>(null);
    private numberOfItemInBasket = new BehaviorSubject<number>(0);
    numberOfItemInBasket$ = this.numberOfItemInBasket.asObservable();
    basket$ = this._basketSource.asObservable();

    getBasketByID(basketId: string): Observable<IBasket | null> {
        const currentBasket = this.getCurrentBasket();
        if (!currentBasket) {
            return this._http.get<IBasket>(`${API_URLS.Localhost + API_URLS.Basket}?id=${basketId}`).pipe(
                tap(basket => {
                    this._basketSource.next(basket)
                    this.numberOfItemInBasket.next(basket.basketItems.length);
                }),
                catchError(error => {
                    console.error('Error fetching basket by ID:', error);
                    return of(null);
                })
            );
        }
        return this.basket$;
    }
    setBasketInRedis(basket: IBasket): Observable<IBasket | null> {
        return this._http.put<IBasket>(`${API_URLS.Localhost + API_URLS.Basket}`, basket).pipe(
            tap(response => {
                this._basketSource.next(response);
                this.numberOfItemInBasket.next(basket.basketItems.length);
            }),
            catchError(error => {
                return of(null);
            })
        )
    }

    addItemInBasket(product: IProduct, quantity = 1): Observable<IBasket | null> {
        const basketItem = this.mapProductToBasketItem(product, quantity);
        const currentBasket = this.getCurrentBasket() ?? this.createBasket();
        const updatedBasket: IBasket = {
            ...currentBasket,
            basketItems: this.addOrUpdateItem([...currentBasket.basketItems], basketItem) // Copy to avoid mutating the original
        };
        if (this.areBasketsEqual(currentBasket, updatedBasket)) {
            console.log('Basket not changed, skipping API request.');
            return of(currentBasket);
        }
        return this.setBasketInRedis(updatedBasket);
    }

    updateBasketItemQuantity(basketItem: IBasketItem, quantity: number): Observable<IBasket | null> {
        const currentBasket = this.getCurrentBasket() ?? this.createBasket();
        if (basketItem.quantity == quantity) {
            return of(currentBasket);
        }
        const itemWithUpdateQantity = { ...basketItem, quantity };
        const updatedBasketItems = this.addOrUpdateItem(currentBasket.basketItems, itemWithUpdateQantity);
        currentBasket.basketItems = updatedBasketItems;
        return this.setBasketInRedis(currentBasket);
    }

    deleteItemFromBasket(item: IBasketItem): Observable<IBasket | null> {
        const currentBasket = this.getCurrentBasket() ?? this.createBasket();
        const updatedBasketItems = currentBasket.basketItems.filter(B => B.productId !== item.productId);
        const updatedBasket: IBasket = { ...currentBasket, basketItems: updatedBasketItems };
        return this.setBasketInRedis(updatedBasket);
    }

    private areBasketsEqual(basket1: IBasket, basket2: IBasket): boolean {
        return JSON.stringify(basket1) === JSON.stringify(basket2);
    }

    private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem): IBasketItem[] {
        const existingItem = items.find(item => item.productId == itemToAdd.productId);
        if (existingItem) {
            existingItem.quantity = itemToAdd.quantity;
        } else {
            items.push(itemToAdd);
        }
        return items;
    }

    getCurrentBasket(): IBasket | null {
        return this._basketSource.value;
    }
    
    private createBasket(): IBasket {
        const basket = new Basket();
        localStorage.setItem('basket_id', basket.id);
        return basket;
    }


    private mapProductToBasketItem(product: IProduct, quantity = 1): IBasketItem {
        const applicablePrice = product.offerPrice && product.offerPrice > 0 ? product.offerPrice : product.price;
        return {
            productId: product.id,
            productName: product.name,
            description: product.description,
            brand: product.brand,
            quantity: quantity,
            price: product.price,
            offerPrice: product.offerPrice ?? null,
            imageUrl: product.imageUrl,
            unitOfStock: product.stockQuantity,
            subTotal: applicablePrice * quantity,
            deliveryTimeInDays: product.deliveryTimeInDays
        };
    }
}

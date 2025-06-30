import { Injectable } from '@angular/core';
import { IAddress } from '../models/interfaces/IAddress';
import { HttpClient } from '@angular/common/http';
import { IBaseApiResponse } from '../models/interfaces/IBaseApiResponse';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AddressService {
    private cache$ = new BehaviorSubject<IAddress[] | null>(null); // Cache storage
    constructor(private _http: HttpClient) { }

    postAddress(address: IAddress): Observable<IBaseApiResponse> {
        return this._http.post<IBaseApiResponse>('https://localhost:7197/api/Account/address', address);
    }

    getAddress(): Observable<IAddress[]> {
        if (this.cache$.value) {
            return of(this.cache$.value); 
        }
        return this._http.get<IAddress[]>('https://localhost:7197/api/Account/addresses').pipe(
            tap(data => this.cache$.next(data))
        );
    }

    clearCache() {
        this.cache$.next(null); 
    }
}

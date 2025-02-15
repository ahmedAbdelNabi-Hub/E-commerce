import { Injectable } from '@angular/core';
import { IAddress } from '../models/interfaces/IAddress';
import { HttpClient } from '@angular/common/http';
import { IBaseApiResponse } from '../models/interfaces/IBaseApiResponse';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AddressService {
    constructor(private _http: HttpClient) { }

    postAddress(address: IAddress): Observable<IBaseApiResponse> {
        return this._http.post<IBaseApiResponse>('https://localhost:7197/api/Account/address', address);
    }

    getAddress(): Observable<IAddress[]> {
        return this._http.get<IAddress[]>('https://localhost:7197/api/Account/addresses');
    }

}
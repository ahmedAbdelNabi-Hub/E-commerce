import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { GroupedResultDto } from '../models/interfaces/GroupedResultDto';
import { IProduct } from '../models/interfaces/IProduct';
import { API_URLS } from '../constant/api-urls';
import { IProductSpecParams } from '../models/interfaces/IProductSpecParams';
import { IPaginationDto } from '../models/interfaces/IPaginationDto';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private dataCache: GroupedResultDto<string, IProduct>[] | null = null;
  private newArrivalsCache: IProduct[] | null = null;
  constructor(private _Http: HttpClient) { }

  getProductsOnOfferGroupedByCategory(): Observable<GroupedResultDto<string, IProduct>[]> {
    if (!this.dataCache) {
      return this._Http.get<GroupedResultDto<string, IProduct>[]>(`${API_URLS.Localhost + API_URLS.prodcut}offers/grouped`).pipe(
        tap(response => {
          this.dataCache = response;
        }),
        catchError(error => {
          console.error('Error fetching grouped products:', error);
          return of([]);
        })
      );
    }
    return of(this.dataCache);
  }

  getNewArrivalsProducts(): Observable<IProduct[]> {
    if (!this.newArrivalsCache) {
      console.log(this.newArrivalsCache)
      return this._Http.get<IProduct[]>(`${API_URLS.Localhost + API_URLS.prodcut}NewArrivals`).pipe(
        tap(response => {
          this.newArrivalsCache = response;
          console.log("new prodcut", this.newArrivalsCache);
        }),
        catchError(error => {
          console.error('Error fetching new arrivals products:', error);
          return of([]);
        })
      );
    }
    return of(this.newArrivalsCache);
  }

  getProductWithId(id: number): Observable<IProduct> {
    return this._Http.get<IProduct>(`${API_URLS.Localhost + API_URLS.prodcut}GetProduct/${id}`)
  }

  getAllProduct(Params: IProductSpecParams): Observable<IPaginationDto> {
    return this._Http.get<IPaginationDto>(`${API_URLS.Localhost + API_URLS.prodcut}all/prorduct/?CategoryName=${Params.CategoryName}&PageIndex=${Params.PageIndex}&PageSize=${Params.PageSize}`);
  }

  createProduct(productForm: FormData): Observable<any> {
    const apiUrl = `${API_URLS.Localhost + API_URLS.prodcut}Create`;
    console.log(apiUrl);
    return this._Http.post(apiUrl, productForm);  // FormData content type will be set automatically
  }
  deleteProduct(productId: number): Observable<any> {
    const apiUrl = `${API_URLS.Localhost + API_URLS.prodcut}${productId}/Delete`
    return this._Http.delete(apiUrl);
  }
  clearCache(): void {
    this.newArrivalsCache = null;
    this.dataCache = null;
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, shareReplay, tap } from 'rxjs';
import { GroupedResultDto } from '../models/interfaces/GroupedResultDto';
import { IProduct } from '../models/interfaces/IProduct';
import { API_URLS } from '../constant/api-urls';
import { IProductSpecParams } from '../models/interfaces/IProductSpecParams';
import { IPaginationDto } from '../models/interfaces/IPaginationDto';
import { IFilterationDto } from '../models/interfaces/IFilteration';
import { IProductView } from '../models/interfaces/IProductView';
import { ProductView } from '../models/classes/ProductView';
import { IProductAttribute } from '../models/interfaces/IProductAttribute';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private dataCache: GroupedResultDto<string, IProduct>[] | null = null;
  private newArrivalsCache: IProduct[] | null = null;
  private recentlyProductsCache$ = new BehaviorSubject<IPaginationDto | null>(null);
  constructor(private _Http: HttpClient) { }


  getProductsOnOfferGroupedByCategory(): Observable<GroupedResultDto<string, IProduct>[]> {
    if (!this.dataCache) {
      return this._Http.get<GroupedResultDto<string, IProduct>[]>(`${API_URLS.Localhost + API_URLS.prodcut}offers/grouped`).pipe(
        tap(response => {
          this.dataCache = response;
        }),
        catchError(error => {
          return of([]);
        })
      );
    }
    return of(this.dataCache);
  }

  activateProduct(productId: number): Observable<any> {
    return this._Http.patch(`${API_URLS.Localhost + API_URLS.prodcut}${productId}/activate`, {});
  }

  getProductAttributes(productId: number): Observable<IProductAttribute[]> {
    return this._Http.get<IProductAttribute[]>(`${API_URLS.Localhost + API_URLS.prodcut}${productId}/attributes`);
  }

  getProductWithIdAndStoreInRedis(id: number, isStoreInRedis: boolean): Observable<IProduct> {
    const productIsViewByUser = this.getUserViewProduct();
    const params = new HttpParams()
      .set('viewId', productIsViewByUser.viewId)
      .set('isStoreInRedis', isStoreInRedis.toString());
    return this._Http.get<IProduct>(`${API_URLS.Localhost + API_URLS.prodcut}${id}`, { params });
  }

  getAllProduct(Params: IProductSpecParams): Observable<IPaginationDto> {
    if (Params) {
      return this._Http.get<IPaginationDto>(`${API_URLS.Localhost + API_URLS.prodcut}?CategoryName=${Params.CategoryName}&PageIndex=${Params.PageIndex}&PageSize=${Params.PageSize}`);
    }
    return of();
  }

  getAllFilterWithCategoy(CategoryName: string): Observable<IFilterationDto[]> {
    return this._Http.get<IFilterationDto[]>(`${API_URLS.Localhost + API_URLS.filter}?categoryName=${CategoryName}`);
  }

  createProduct(productForm: FormData): Observable<any> {
    const apiUrl = `${API_URLS.Localhost + API_URLS.prodcut}`;
    console.log(apiUrl);
    console.log([...productForm as any].map(([key, value]) => ({ key, value })));

    return this._Http.post(apiUrl, productForm);
  }
  deleteProduct(productId: number): Observable<any> {
    const apiUrl = `${API_URLS.Localhost + API_URLS.prodcut}${productId}`
    return this._Http.delete(apiUrl);
  }

  updateProduct(id: string, product: FormData): Observable<any> {
    const apiUrl = `${API_URLS.Localhost + API_URLS.prodcut}`
    return this._Http.put(`${apiUrl}${id}`, product);
  }

  getUserViewProduct(): IProductView {
    let userKey = localStorage.getItem('viewKey');
    if (!userKey) {
      return this.createNewViewForUser();
    }

    const productViewForUser: IProductView = {
      IsStoreInRedis: true,
      viewId: userKey!,
      ProductReadDto: []
    };
    return productViewForUser;
  }

  createNewViewForUser(): IProductView {
    const newViewId = crypto.randomUUID();
    const productViewForUser: IProductView = {
      IsStoreInRedis: true,
      viewId: newViewId,
      ProductReadDto: []
    };
    localStorage.setItem('viewKey', productViewForUser.viewId);
    console.log("New View ID stored: ", newViewId); // Log to verify the stored value
    return productViewForUser;
  }

  GetRecentlyProducts(): Observable<IPaginationDto> {
    if (this.recentlyProductsCache$.value) {
      return of(this.recentlyProductsCache$.value);
    }
    const userKey = this.getUserViewProduct().viewId;
    return this._Http.get<IPaginationDto>(`${API_URLS.Localhost + API_URLS.prodcut}recent/${userKey}`).pipe(
      tap(data => this.recentlyProductsCache$.next(data)),
      shareReplay(1)
    );
  }

  clearCache(): void {
    this.newArrivalsCache = null;
    this.recentlyProductsCache$.next(null);
    this.dataCache = null;
  }
}


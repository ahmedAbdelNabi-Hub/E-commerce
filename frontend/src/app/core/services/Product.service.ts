import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { GroupedResultDto } from '../models/interfaces/GroupedResultDto';
import { IProduct } from '../models/interfaces/IProduct';
import { API_URLS } from '../constant/api-urls';
import { IProductSpecParams } from '../models/interfaces/IProductSpecParams';
import { IPaginationDto } from '../models/interfaces/IPaginationDto';
import { IFilterationDto } from '../models/interfaces/IFilteration';
import { IProductView } from '../models/interfaces/IProductView';
import { ProductView } from '../models/classes/ProductView';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private dataCache: GroupedResultDto<string, IProduct>[] | null = null;
  private newArrivalsCache: IProduct[] | null = null;
  private ProductIsViewByUser !: IProductView;
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

  getNewArrivalsProducts(): Observable<IProduct[]> {
    if (!this.newArrivalsCache) {
      console.log(this.newArrivalsCache)
      return this._Http.get<IProduct[]>(`${API_URLS.Localhost + API_URLS.prodcut}NewArrivals`).pipe(
        tap(response => {
          this.newArrivalsCache = response;
          console.log("new prodcut", this.newArrivalsCache);
        }),
        catchError(error => {
          return of([]);
        })
      );
    }
    return of(this.newArrivalsCache);
  }

  getProductWithIdAndStoreInRedis(id: number, isStoreInRedis: boolean): Observable<IProduct> {
    const productIsViewByUser = this.getUserViewProduct();
    const params = new HttpParams()
      .set('viewId', productIsViewByUser.viewId)
      .set('isStoreInRedis', isStoreInRedis.toString());
    return this._Http.get<IProduct>(`${API_URLS.Localhost + API_URLS.prodcut}GetProduct/${id}`, { params });
  }

  getAllProduct(Params: IProductSpecParams): Observable<IPaginationDto> {
    if (Params) {
      return this._Http.get<IPaginationDto>(`${API_URLS.Localhost + API_URLS.prodcut}all/prorduct/?CategoryName=${Params.CategoryName}&PageIndex=${Params.PageIndex}&PageSize=${Params.PageSize}`);
    }
    return of();
  }

  getAllFilterWithCategoy(CategoryName: string): Observable<IFilterationDto[]> {
    return this._Http.get<IFilterationDto[]>(`${API_URLS.Localhost + API_URLS.filter}?categoryName=${CategoryName}`);
  }

  createProduct(productForm: FormData): Observable<any> {
    const apiUrl = `${API_URLS.Localhost + API_URLS.prodcut}Create`;
    console.log(apiUrl);
    console.log([...productForm as any].map(([key, value]) => ({ key, value })));

    return this._Http.post(apiUrl, productForm);  // FormData content type will be set automatically
  }
  deleteProduct(productId: number): Observable<any> {
    const apiUrl = `${API_URLS.Localhost + API_URLS.prodcut}${productId}`
    return this._Http.delete(apiUrl);
  }

  updateProduct(id: string, product: FormData): Observable<any> {
    return this._Http.post(`https://localhost:7197/api/Product/${id}/update`, product);
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
      const userKey  = this.getUserViewProduct().viewId;
      return this._Http.get<IPaginationDto>(`${API_URLS.Localhost + API_URLS.prodcut}GetRecentlyProducts/${userKey}`);
    
  }

  clearCache(): void {
    this.newArrivalsCache = null;
    this.dataCache = null;
  }
}


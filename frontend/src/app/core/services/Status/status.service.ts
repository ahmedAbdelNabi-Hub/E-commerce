import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStatus } from '../../models/interfaces/IStatus';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { API_URLS } from '../../constant/api-urls';
import { IProductSpecParams } from '../../models/interfaces/IProductSpecParams';
import { IPaginationDto } from '../../models/interfaces/IPaginationDto';
import { IProduct } from '../../models/interfaces/IProduct';

@Injectable({ providedIn: 'root' })
export class StatusService {
  constructor(private http: HttpClient) { }
  private isStatusPopupVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isStatusPopupVisible$ = this.isStatusPopupVisible.asObservable();
  private productIdIsAssginTheStatus !:number | null;

  getStatuses(): Observable<IStatus[]> {
    return this.http.get<IStatus[]>(API_URLS.Localhost + '' + API_URLS.Status + 'GetAllStatuses');    
  }

  getProductWithStatus(_params: IProductSpecParams): Observable<IPaginationDto> {
    const url = `${API_URLS.Localhost}${API_URLS.Status}GetProductsByStatus?` +
      `StatusId=${encodeURIComponent(_params.StatusId || '')}` +
      `&CategoryName=${encodeURIComponent(_params.CategoryName || '')}` +
      `&PageIndex=${encodeURIComponent(_params.PageIndex || '')}` +
      `&PageSize=${encodeURIComponent(_params.PageSize || '')}`;
    return this.http.get<IPaginationDto>(url);
  }

  showStatusPopup(productIdIsAssginTheStatus:number): void {
    this.isStatusPopupVisible.next(true);
    this.productIdIsAssginTheStatus=productIdIsAssginTheStatus;
  }
   
  AssignStatus(statusId: number): Observable<any> {
    const payload = {
      productId: this.productIdIsAssginTheStatus,
      statusId: statusId,
      changedBy: "admin"
    };
    return this.http.post(`${API_URLS.Localhost}${API_URLS.Status}AssignStatus`, payload);
  }

  deleteStatus(productId:number,statusId:number):Observable<any>{
    const apiUrl = `${API_URLS.Localhost}${API_URLS.Status}DeleteProductStatus/${productId}/${statusId}`;
    return this.http.delete(apiUrl);
  }
  
  hiddenStatusPopup(): void {
    this.isStatusPopupVisible.next(false);
    this.productIdIsAssginTheStatus=null;
  }

}
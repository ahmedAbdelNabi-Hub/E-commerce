import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategory } from '../../models/interfaces/ICategory';
import { catchError, Observable, of, tap } from 'rxjs';
import { API_URLS } from '../../constant/api-urls';

@Injectable({providedIn: 'root'})
export class CategoryService {
    private Categories : ICategory[] | null = null;
    constructor(private _Http:HttpClient) { }
    
    getAllCategories():Observable<ICategory[]>{
      return this._Http.get<ICategory[]>(API_URLS.Localhost+API_URLS.category+'GetAllCategorys').pipe(
        tap(response =>{
            if(response!=null){
              this.Categories=response;
            }
        }),
        catchError(error=>{
           return of([]);
        })
      );
    }

}
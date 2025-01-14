
import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Resolve, Router, RouterStateSnapshot, } from '@angular/router';
import { ProductService } from '../services/Product.service';
import { EMPTY, Observable, of } from 'rxjs';
import { IProduct } from '../models/interfaces/IProduct';


@Injectable({
    providedIn: 'root'
})
export class ProductResolve implements Resolve<IProduct | never[]> {
    private _productService = inject(ProductService);
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) :Observable<IProduct | never[]>{
     console.log(route.queryParams['sku'])
     console.log(route.queryParams)
     const sku = +route.queryParams['sku'] ;
     return sku ?  this._productService.getProductWithId(sku): of([]);
    }

}


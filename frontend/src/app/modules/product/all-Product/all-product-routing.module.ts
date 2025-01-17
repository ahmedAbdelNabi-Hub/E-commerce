import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllProductListComponent } from '../../../admin/pages/product/all-product-list/all-product-list.component';
import { ProductsComponent } from '../../../pages/products/products.component';
const routes: Routes = [{ path: '', component: ProductsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllProductModuleRouting { }

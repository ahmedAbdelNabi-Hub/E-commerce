import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from '../../../pages/product-details/product-details.component';
const routes: Routes = [{ path: '', component: ProductDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductDetailRoutingModule { }

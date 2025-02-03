import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailRoutingModule } from './product-detail-routing.module';
import { ProductDetailsComponent } from '../../../pages/product-details/product-details.component';
import { SharedModule } from "../../../shared/shared.module";


@NgModule({
  declarations: [
    ProductDetailsComponent
  ],
  imports: [
    CommonModule,
    ProductDetailRoutingModule,
    SharedModule
]
})
export class ProductDetailModule { }

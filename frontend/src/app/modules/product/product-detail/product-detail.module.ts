import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailRoutingModule } from './product-detail-routing.module';
import { ProductDetailsComponent } from '../../../pages/product-details/product-details.component';
import { SharedModule } from "../../../shared/shared.module";
import { AttributeDetailsComponent } from '../../../pages/product-details/components/Attribute/attribute.component';


@NgModule({
  declarations: [
    ProductDetailsComponent, AttributeDetailsComponent
  ],
  imports: [
    CommonModule,
    ProductDetailRoutingModule,
    SharedModule
  ]
})
export class ProductDetailModule { }

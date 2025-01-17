import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from '../../../pages/products/products.component';
import { SharedModule } from "../../../shared/shared.module";
import { FilterComponent } from '../../../pages/products/components/filter/filter.component';
import { FormsModule } from '@angular/forms';
import { AllProductModuleRouting } from './all-product-routing.module';

@NgModule({
  declarations: [
    ProductsComponent,
    FilterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    AllProductModuleRouting

  ]
})
export class AllProductModule { }

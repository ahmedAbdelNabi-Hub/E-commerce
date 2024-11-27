import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import { LOCALE_ID } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
registerLocaleData(localeAr, 'ar'); // Register Arabic locale
import { NgApexchartsModule } from "ng-apexcharts";
import { AccordionModule } from 'primeng/accordion';
import { AllProductListComponent } from './pages/product/all-product-list/all-product-list.component';
import { AddProductComponent } from './pages/product/add-product/add-product.component';
import { ProductFormComponent } from './pages/product/add-product/components/product-form/product-form.component';
import { ProductStatusManagementComponent } from './pages/product-status-management/product-status-management.component';
import { StatusPopupComponent } from './pages/product/all-product-list/components/status-popup/status-popup.component';
import { StatusCardComponent } from './pages/product-status-management/components/status-card/status-card.component';
import { SwitchComponent } from './pages/product-status-management/components/switch/switch.component';
import { TableComponent } from './pages/product-status-management/components/table/table.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    AddProductComponent,
    ProductFormComponent,
    AllProductListComponent,
    ProductStatusManagementComponent,
    StatusPopupComponent,
    StatusCardComponent,
    SwitchComponent,
    TableComponent,
  ],
  imports: [
    CommonModule,
    AccordionModule,
    NgApexchartsModule,
    AdminRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule
  ],

  providers: [{ provide: LOCALE_ID, useValue: 'ar' }]

})
export class AdminModule { }

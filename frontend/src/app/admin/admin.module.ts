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
import { AllProductListComponent } from './pages/product/all-product-list/all-product-list.component';
import { AddProductComponent } from './pages/product/add-product/add-product.component';
import { ProductFormComponent } from './pages/product/add-product/components/product-form/product-form.component';
import { ProductStatusManagementComponent } from './pages/product-status-management/product-status-management.component';
import { StatusPopupComponent } from './pages/product/all-product-list/components/status-popup/status-popup.component';
import { StatusCardComponent } from './pages/product-status-management/components/status-card/status-card.component';
import { SwitchComponent } from './pages/product-status-management/components/switch/switch.component';
import { TableComponent } from './pages/product-status-management/components/table/table.component';
import { UploadFileAttributeComponent } from './pages/product/add-product/components/upload-file-attribute/upload-file-attribute.component';
import { DeleteModalComponent } from './components/Modals/delete-modal/delete-modal.component';
import { AdvertisementListComponent } from './pages/advertisement/components/list/advertisement-list/advertisement-list.component';
import { AdvertisementCreateComponent } from './pages/advertisement/components/create/advertisement-create/advertisement-create.component';
import { AdvertisementEditComponent } from './pages/advertisement/components/edit/advertisement-edit/advertisement-edit.component';
import { AdvertisementDetailsComponent } from './pages/advertisement/components/details/advertisement-details/advertisement-details.component';
import { AdvertisementComponent } from './pages/advertisement/advertisement.component';

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
    UploadFileAttributeComponent,
    DeleteModalComponent,
    AdvertisementListComponent,
    AdvertisementCreateComponent,
    AdvertisementEditComponent,
    AdvertisementDetailsComponent,
    AdvertisementComponent,
  ],
  imports: [
    CommonModule,
    NgApexchartsModule,
    AdminRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule
  ],

  providers: [{ provide: LOCALE_ID, useValue: 'ar' }]

})
export class AdminModule { }

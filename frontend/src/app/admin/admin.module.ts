import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from "ng-apexcharts";
import { AllProductListComponent } from './pages/product/all-product-list/all-product-list.component';
import { AddProductComponent } from './pages/product/add-product/add-product.component';
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
import { OrderStatusChartComponent } from './pages/admin-dashboard/components/charts/order-status-chart/order-status-chart.component';
import { RevenueChartComponent } from './pages/admin-dashboard/components/charts/revenue-chart/revenue-chart.component';
import { OrderComponent } from './pages/order/order.component';
import { AdminSidebarComponent } from './pages/admin-dashboard/components/admin-sidebar/admin-sidebar.component';
import { ImageUploaderComponent } from './pages/admin-dashboard/components/image-uploader/image-uploader.component';
import { ProductAttributeComponent } from './pages/product-Attribute/product-attribute.component';
import { ProductFormComponent } from './pages/product-from/product-form.component';
import { AttributeComponent } from './pages/product-from/components/Attribute/attribute.component';
import { TopSellerTableComponent } from './pages/admin-dashboard/components/top-seller-table/top-seller-table.component';
import { EditorModule } from 'primeng/editor';

@NgModule({
  declarations: [
    AdminComponent,
    ImageUploaderComponent,
    AdminSidebarComponent,
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
    OrderStatusChartComponent,
    RevenueChartComponent,
    OrderComponent,
    ProductAttributeComponent,
    AttributeComponent,
    TopSellerTableComponent,
  ],
  imports: [
    CommonModule,
    NgApexchartsModule,
    AdminRoutingModule,
    FormsModule,
    SharedModule,
    EditorModule,
    ReactiveFormsModule
  ],


})
export class AdminModule { }

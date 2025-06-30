import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './admin.component';
import { AllProductListComponent } from './pages/product/all-product-list/all-product-list.component';
import { AddProductComponent } from './pages/product/add-product/add-product.component';
import { ProductStatusManagementComponent } from './pages/product-status-management/product-status-management.component';
import { AdvertisementListComponent } from './pages/advertisement/components/list/advertisement-list/advertisement-list.component';
import { AdvertisementCreateComponent } from './pages/advertisement/components/create/advertisement-create/advertisement-create.component';
import { OrderComponent } from './pages/order/order.component';
import { ProductAttributeComponent } from './pages/product-Attribute/product-attribute.component';
import { ProductFormComponent } from './pages/product-from/product-form.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent, data: { animation: 'dashboard' } },
      { path: 'orders', component: OrderComponent, data: { animation: 'orders' } },
      { path: 'product', component: ProductFormComponent, data: { animation: 'productForm' } },
      { path: 'view-products', component: AllProductListComponent, data: { animation: 'viewProducts' } },
      { path: 'product-attributes', component: ProductAttributeComponent, data: { animation: 'attribute' } },
      { path: 'statuses', component: ProductStatusManagementComponent, data: { animation: 'statuses' } },
      { path: 'all-advertisement', component: AdvertisementListComponent, data: { animation: 'AdvertisementList' } },
      { path: 'create-advertisement', component: AdvertisementCreateComponent, data: { animation: 'create' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }

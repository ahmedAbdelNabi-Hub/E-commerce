import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './admin.component';

import { AllProductListComponent } from './pages/product/all-product-list/all-product-list.component';
import { AddProductComponent } from './pages/product/add-product/add-product.component';
import { ProductFormComponent } from './pages/product/add-product/components/product-form/product-form.component';
import { ProductStatusManagementComponent } from './pages/product-status-management/product-status-management.component';
import { AdvertisementComponent } from './pages/advertisement/advertisement.component';
import { AdvertisementListComponent } from './pages/advertisement/components/list/advertisement-list/advertisement-list.component';
import { AdvertisementCreateComponent } from './pages/advertisement/components/create/advertisement-create/advertisement-create.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', component: AdminDashboardComponent, data: { animation: 'dashboard' } },
      { path: 'view-products', component: AllProductListComponent, data: { animation: 'viewProducts' } },
      { path: 'statuses', component: ProductStatusManagementComponent, data: { animation: 'statuses' } },
      { path: 'all-advertisement', component: AdvertisementListComponent ,data: { animation: 'AdvertisementList' } },
      { path: 'create-advertisement', component: AdvertisementCreateComponent ,data: { animation: 'create' }},
      { path: 'product', component: AddProductComponent, children: [{ path: '', component: ProductFormComponent }] },

    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }

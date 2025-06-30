import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderSuccessComponent } from './pages/order-success/order-success.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const routes: Routes = [
  {
    path: "", component: HomeComponent,
  },
  { path: 'product/:category', loadChildren: () => import('./modules/product/all-Product/all-product.module').then(m => m.AllProductModule) },
  { path: 'product/:category/:slug', loadChildren: () => import('./modules/product/product-detail/product-detail.module').then(m => m.ProductDetailModule) },
  { path: 'checkout/cart', loadChildren: () => import('./modules/shopping-cart/shopping-cart/shopping-cart.module').then(m => m.ShoppingCartModule) },
  { path: 'account', loadChildren: () => import('./modules/account/account.module').then(m => m.AccountModule) },
  { path: 'auth/login', canActivate: [], loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule) },
  { path: 'checkout/s', component: CheckoutComponent },
  { path: 'order-success', component: OrderSuccessComponent },
  { path: 'auth/create/account', canActivate: [], loadChildren: () => import('./modules/register/register.module').then(m => m.RegisterModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'Not-Found', component: NotFoundComponent },
  { path: '**', redirectTo: "Not-Found", pathMatch: 'full' }
];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',

};

@NgModule({
  imports: [
    RouterModule.forRoot(routes, routerOptions)
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  exports: [RouterModule]
})
export class AppRoutingModule { }

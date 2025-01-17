import { NgModule } from '@angular/core';
import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: "", component: HomeComponent,
  },
  { path: 'product/:category', loadChildren: () => import('./modules/product/all-Product/all-product.module').then(m => m.AllProductModule) },
  { path: 'product/:category/:slug', loadChildren: () => import('./modules/product/product-detail/product-detail.module').then(m => m.ProductDetailModule) },
  { path: 'checkout/cart', loadChildren: () => import('./modules/shopping-cart/shopping-cart/shopping-cart.module').then(m => m.ShoppingCartModule) },
  { path: 'account', loadChildren: () => import('./modules/account/account.module').then(m => m.AccountModule) },
  { path: 'login', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: '**', component: NotFoundComponent }
];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled'
};

@NgModule({
  imports: [
    RouterModule.forRoot(routes, routerOptions)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

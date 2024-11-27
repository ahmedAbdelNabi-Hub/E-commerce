import { NgModule } from '@angular/core';
import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: "", component: HomeComponent,
  },
  { path: 'product/:category/:slug', loadChildren: () => import('./modules/product/product-detail/product-detail.module').then(m => m.ProductDetailModule) },
  { path: 'checkout/cart', loadChildren: () => import('./modules/shopping-cart/shopping-cart/shopping-cart.module').then(m => m.ShoppingCartModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }
];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled'
};

@NgModule({
  imports: [
    RouterModule.forRoot(routes, routerOptions)  //  { preloadingStrategy: PreloadAllModules }
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

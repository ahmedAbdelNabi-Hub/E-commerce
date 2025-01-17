import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from '../../pages/account/account.component';
import { OrderComponent } from '../../pages/account/components/order/order.component';
import { AddressComponent } from '../../pages/account/components/address/address.component';

const routes: Routes = [
  {
    path: '', component: AccountComponent, children: [
      { path: '', component: OrderComponent },
      { path: 'address', component: AddressComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule { }

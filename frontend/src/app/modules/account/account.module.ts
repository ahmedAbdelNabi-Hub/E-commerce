import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from '../../pages/account/account.component';
import { SharedModule } from '../../shared/shared.module';

import { AccountRoutingModule } from './account-routing.module';
import { AccountSidebarComponent } from '../../pages/account/components/account-sidebar/account-sidebar.component';
import { AddressFromComponent } from '../../pages/account/components/address-from/address-from.component';
import { AddressCardComponent } from '../../pages/account/components/address-card/address-card.component';
import { AddressComponent } from '../../pages/account/components/address/address.component';
import { OrderCardComponent } from '../../pages/account/components/order-card/order-card.component';
import { OrderDetailsComponent } from '../../pages/account/components/order-details/order-details.component';
import { OrderComponent } from '../../pages/account/components/order/order.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AccountComponent,
    AddressFromComponent,
    AccountSidebarComponent,
    AddressComponent,
    OrderComponent,
    OrderDetailsComponent,
    OrderCardComponent,
    AddressCardComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    AccountRoutingModule,
    ReactiveFormsModule

  ]
})
export class AccountModule { }

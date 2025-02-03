import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../../pages/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterRoutingModule } from './register-routing.module';
import { ConfirmEmailComponent } from '../../pages/register/components/confirm-email/confirm-email.component';
import { EmailAndPasswordComponent } from '../../pages/register/components/email-and-password/email-and-password.component';
import { NameFormComponent } from '../../pages/register/components/name-form/name-form.component';

@NgModule({
  declarations: [RegisterComponent,
    NameFormComponent,
    EmailAndPasswordComponent,
    ConfirmEmailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RegisterRoutingModule
  ],
})
export class RegisterModule { }

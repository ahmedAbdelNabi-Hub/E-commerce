import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from '../../pages/register/register.component';
import { NameFormComponent } from '../../pages/register/components/name-form/name-form.component';
import { EmailAndPasswordComponent } from '../../pages/register/components/email-and-password/email-and-password.component';
import { ConfirmEmailComponent } from '../../pages/register/components/confirm-email/confirm-email.component';

const routes: Routes = [
  {
    path: '', component: RegisterComponent, children: [{
      path: '', component: NameFormComponent
    },
    {
      path:'email-password',component:EmailAndPasswordComponent
    },
    {
      path:'confirm-email',component:ConfirmEmailComponent
    }
  ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }

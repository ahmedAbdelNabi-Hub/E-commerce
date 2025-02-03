import { Component, inject, OnInit } from '@angular/core';
import { moveLeftToRight } from '../../../../shared/animations/RouteAnimation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationService } from '../../../../core/services/registration.service';
import { getErrorMessage } from '../../../../core/utils/form-error-messages';

@Component({
  selector: 'app-email-and-password',
  templateUrl: './email-and-password.component.html',
  styleUrl: './email-and-password.component.css',
  animations: [moveLeftToRight]
})
export class EmailAndPasswordComponent implements OnInit {
  NameForm!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private registrationService = inject(RegistrationService);
  password: string = ''; // Bind password value
  showPassword: boolean = false; // Flag to toggle visibility

  ngOnInit(): void {
    this.initalControllers();
    this.validToken();
    this.registrationService.updateContent(['Basic Information', 'Please provide your contact details and set up your account securely.'])
  }

  initalControllers() {
    this.NameForm = this.formBuilder.group({
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }
  validToken() {
    this._activatedRoute.snapshot.queryParamMap.get('flv');
    const isValid = this.registrationService.validateTokenFromQueryParam(this._activatedRoute);
    if (!isValid) {
      this.router.navigate(['/auth/error']);
    }
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Toggle the visibility flag
  }
  isControlInvalid(controlName: string): boolean | undefined {
    const control = this.NameForm.get(controlName);
    return control?.invalid && (control?.touched && control?.dirty);
  }
  getErrorMessage(controlName: string): string | null {
    return getErrorMessage(this.NameForm, controlName);
  }

  submitForm() {
    if (this.NameForm.valid) {
      this.registrationService.setLoadingState(true);
      this.registrationService.updateFormData(this.NameForm.value);
      const isValid = this.registrationService.validateTokenAndProceed(
        this._activatedRoute,
        6
      );
      if (isValid) {
        this.registrationService.simulateDelay().subscribe(() => {
          this.registrationService.setLoadingState(false);
          const currentToken = this._activatedRoute.snapshot.queryParamMap.get('flv');
          this.router.navigate(['/auth/create/account/confirm-email'], {
            queryParams: { flv: currentToken },
            queryParamsHandling: 'merge',
          });
        });
      }
    }

  }
}
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationService } from '../../../../core/services/registration.service'; // Import the RegistrationService
import { moveLeftToRight, moveRightToLeft } from '../../../../shared/animations/RouteAnimation';
import { lettersAndSpacesValidator } from '../../../../core/validators/general-validators';
import { getErrorMessage } from '../../../../core/utils/form-error-messages';

@Component({
  selector: 'app-name-form',
  templateUrl: './name-form.component.html',
  styleUrls: ['./name-form.component.css'],
  animations: [moveLeftToRight, moveRightToLeft]
})
export class NameFormComponent implements OnInit {
  NameForm!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private registrationService = inject(RegistrationService);
  ngOnInit(): void {
    this.initalControllers();
    this.addTokenToQueryParams();
    this.registrationService.setDefContent();
    this.registrationService.clearFormData();

  }
  initalControllers() {
    this.NameForm = this.formBuilder.group({
      firstName: ['', [Validators.required, lettersAndSpacesValidator()]],
      lastName: ['', [Validators.required, lettersAndSpacesValidator()]]
    });
  }
  addTokenToQueryParams() {
    const token = this.registrationService.generateStrongRandomToken(); // Generate token
    this.registrationService.storeToken(token);
    this.router.navigate([], {
      relativeTo: this._activatedRoute,
      queryParams: { flv: token },
      queryParamsHandling: 'merge', // Keep other existing query params
    });
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
        2
      );
      if (isValid) {
        this.registrationService.simulateDelay().subscribe(() => {
          this.registrationService.setLoadingState(false);
          const currentToken = this._activatedRoute.snapshot.queryParamMap.get('flv');
          this.router.navigate(['/auth/create/account/email-password'], {
            queryParams: { flv: currentToken },
            queryParamsHandling: 'merge',
          });
        });
      }
    }

  }
}

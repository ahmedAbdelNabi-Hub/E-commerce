import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { moveLeftToRight } from '../../../../shared/animations/RouteAnimation';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { getErrorMessage } from '../../../../core/utils/form-error-messages';
import { tap, takeUntil, catchError, finalize } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { AuthService } from '../../../../core/services/registration.service';

@Component({
  selector: 'app-email-and-password',
  templateUrl: './email-and-password.component.html',
  styleUrl: './email-and-password.component.css',
  animations: [moveLeftToRight]
})
export class EmailAndPasswordComponent implements OnInit, OnDestroy {
  NameForm!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private registrationService = inject(AuthService);

  isLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);
  submitAttempted = signal<boolean>(false);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeForm();
    this.validateToken();
    this.updateRegistrationContent();
  }

  ngOnDestroy(): void {
    // Prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.NameForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(254)
        ]
      ],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11)
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(128),
          this.strongPasswordValidator
        ]
      ],
      confirmPassword: [
        '',
        [
          Validators.required
        ]
      ]
    }, {
      validators: this.passwordMatchValidator
    });

    // Listen to password changes to revalidate confirm password
    this.NameForm.get('password')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const confirmPasswordControl = this.NameForm.get('confirmPassword');
        if (confirmPasswordControl?.value) {
          confirmPasswordControl.updateValueAndValidity();
        }
      });
  }

  private validateToken(): void {
    try {
      this.isLoading.set(true);
      const token = this._activatedRoute.snapshot.queryParamMap.get('flv');

      if (!token) {
        this.handleTokenError('No token provided');
        return;
      }

      const isValid = this.registrationService.validateTokenFromQueryParam(this._activatedRoute);
      if (!isValid) {
        this.handleTokenError('Invalid token');
        return;
      }
    } catch (error) {
      this.handleTokenError('Token validation failed');
    } finally {
      this.isLoading.set(false);
    }
  }

  private handleTokenError(message: string): void {
    console.error('Token validation error:', message);
    this.router.navigate(['/auth/error'], {
      queryParams: { error: 'invalid_token' }
    });
  }

  private updateRegistrationContent(): void {
    try {
      this.registrationService.updateContent([
        'Basic Information',
        'Please provide your contact details and set up your account securely.'
      ]);
    } catch (error) {
      console.error('Failed to update registration content:', error);
    }
  }

  // Custom validators
  private strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(value);

    const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

    if (!isValid) {
      return {
        strongPassword: {
          message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }
      };
    }

    return null;
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  // UI Helper methods
  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.NameForm.get(controlName);
    return !!(control?.invalid && (control?.touched || this.submitAttempted()));
  }

  getErrorMessage(controlName: string): string | null {
    if (controlName === 'confirmPassword' && this.NameForm.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }

    return getErrorMessage(this.NameForm, controlName);
  }

  markAllFieldsAsTouched(): void {
    Object.keys(this.NameForm.controls).forEach(key => {
      const control = this.NameForm.get(key);
      control?.markAsTouched();
      control?.markAsDirty();
    });
  }

  submitForm(): void {
    this.submitAttempted.set(true);

    if (this.NameForm.invalid) {
      this.markAllFieldsAsTouched();
      this.scrollToFirstError();
      return;
    }

    if (this.isSubmitting()) {
      return;
    }

    this.processFormSubmission();
  }

  private processFormSubmission(): void {
    this.isSubmitting.set(true);
    this.registrationService.setLoadingState(true);

    try {
      this.registrationService.updateFormData(this.NameForm.value);
      const isValid = this.registrationService.validateTokenAndProceed(
        this._activatedRoute,
        6
      );

      if (!isValid) {
        this.handleSubmissionError('Token validation failed');
        return;
      }

      this.registrationService.simulateDelay()
        .pipe(
          takeUntil(this.destroy$),
          catchError(error => {
            this.handleSubmissionError('Simulation delay failed', error);
            return of(null);
          })
        )
        .subscribe(result => {
          if (result !== null) {
            this.processRegistration();
          }
        });

    } catch (error) {
      this.handleSubmissionError('Form submission failed', error);
    }
  }

  private processRegistration(): void {
    const currentToken = this._activatedRoute.snapshot.queryParamMap.get('flv');
    this.registrationService.register()
      .pipe(
        takeUntil(this.destroy$),
        tap(response => {
          if (response?.statusCode) {
            this.router.navigate(['/auth/create/account/confirm-email'], {
              queryParams: { flv: currentToken },
              queryParamsHandling: 'merge',
            });
          }
        }),
        catchError(error => {
          this.handleSubmissionError('Registration failed', error);
          return of(null);
        }),
        finalize(() => {
          this.isSubmitting.set(false);
          this.registrationService.setLoadingState(false);
        })
      )
      .subscribe(response => {
        if (response?.statusCode) {
          this.navigateToConfirmEmail(currentToken);
        }
      });
  }

  private navigateToConfirmEmail(token: string | null): void {
    try {
      this.router.navigate(['/auth/create/account/confirm-email'], {
        queryParams: { flv: token },
        queryParamsHandling: 'merge',
      });
    } catch (error) {
      console.error('Navigation failed:', error);
      this.handleSubmissionError('Navigation failed');
    }
  }

  private handleSubmissionError(message: string, error?: any): void {
    console.error('Submission error:', message, error);
    this.isSubmitting.set(false);
    this.registrationService.setLoadingState(false);

    // You could show a toast notification or set an error message here
    // this.errorMessage.set(message);
  }

  private scrollToFirstError(): void {
    setTimeout(() => {
      const firstErrorElement = document.querySelector('.ng-invalid');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  }

  isFieldRequired(controlName: string): boolean {
    const control = this.NameForm.get(controlName);
    return control?.hasValidator(Validators.required) ?? false;
  }

  getFieldValue(controlName: string): any {
    return this.NameForm.get(controlName)?.value;
  }
}
import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/registration.service';
import { MessageService } from '../../core/services/Message.service';
import { delay, finalize, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private socialAuthService = inject(SocialAuthService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(MessageService);

  loginForm!: FormGroup;
  showPassword = false;
  isSubmitting = signal<boolean>(false);
  errorMessage = '';

  // 👇 For memory cleanup
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Optional: Handle Google login
    // this.socialAuthService.authState
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(user => console.log('Google User:', user));
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isSubmitting.set(true);
    this.errorMessage = '';
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).pipe(
      delay(3000),
      tap({
        next: res => {
          localStorage.setItem('token', res.token);
        }
      }),
      switchMap(() => this.authService.getCurrentUser()), 
      tap({
        next: user => {
          localStorage.setItem('role', user.role);
          localStorage.setItem('email', user.email);
          this.toast.showSuccess(`Welcome ${user.name}!`);
          this.router.navigate(['/']);
        },
        error: err => {
          this.toast.showError(err.error?.message || 'Failed to get user info');
        }
      }),
      finalize(() => this.isSubmitting.set(false)), 
      takeUntil(this.destroy$)
    ).subscribe({
      error: err => {
        this.toast.showError(err.error?.message || 'Login failed ');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { delay, tap } from 'rxjs';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { IAuthResponse } from '../../../../core/models/interfaces/IAuthResponse';
import { Perform } from '../../../../core/models/classes/Perform';
import { AuthService } from '../../../../core/services/registration.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})

export class ConfirmEmailComponent implements OnDestroy {
  private authService = inject(AuthService);
  public otpForm!: FormGroup;
  public _asyncDataHandler = new Perform<IAuthResponse>();
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  emailIsConfirm!: string;
  token: any;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      0: new FormControl(''),
      1: new FormControl(''),
      2: new FormControl(''),
      3: new FormControl(''),
      4: new FormControl(''),
      5: new FormControl('')
    });
    this.authService.updateContent([
      'Verify Your Email Address',
      'Enter your contact information and complete your account setup securely.'
    ]);
    this.emailIsConfirm = this.authService.getEmail();
    this.validToken();

  }

  get otpControls() {
    return Object.keys(this.otpForm.controls);
  }

  autoFocusNext(index: number, event: any): void {
    const input = event.target;
    const nextInput = input.parentElement?.children[index + 1];
    if (input.value.length === 1 && nextInput) {
      nextInput.focus();
    }
  }

  onSubmit(): void {
    const otp = Object.values(this.otpForm.value).join('');
    this._asyncDataHandler.load(this.authService.confirmEmail(otp).pipe(
      delay(2000),
      tap(data => {
        if (data) {
          localStorage.setItem("token", data.token);
          this.router.navigate(['/']);
          this.authService.getCurrentUser()
            .pipe(tap(user => {
              localStorage.setItem('role', user.role);
              localStorage.setItem('email', user.email);
              this.router.navigate(['/']);
            }))
            .subscribe();
        }
      })
    ))
  }
  validToken(): void {
    const token = this.activatedRoute.snapshot.queryParamMap.get('token');
    const flv = this.activatedRoute.snapshot.queryParamMap.get('flv');
    if (!this.authService.validateTokenFromQueryParam(this.activatedRoute)) {
      this.router.navigate(['/auth/error']);
      return;
    }
  }

  ngOnDestroy(): void {
    this._asyncDataHandler.unsubscribe();
  }
}



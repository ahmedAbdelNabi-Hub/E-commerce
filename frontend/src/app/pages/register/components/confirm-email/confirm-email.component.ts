import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationService } from '../../../../core/services/registration.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {
  emailIsConfirm: string = '';
  token: string | null = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private registrationService: RegistrationService
  ) { }

  ngOnInit(): void {
    this.registrationService.updateContent([
      'Verify Your Email Address',
      'Enter your contact information and complete your account setup securely.'
    ]);
    this.emailIsConfirm = this.registrationService.getEmail();
    this.validToken();
  }

  validToken(): void {
    const token = this.activatedRoute.snapshot.queryParamMap.get('token');
    const flv = this.activatedRoute.snapshot.queryParamMap.get('flv');

    if (!this.registrationService.validateTokenFromQueryParam(this.activatedRoute)) {
      this.router.navigate(['/auth/error']);
      return;
    }

    if (token) {
      this.token = token;
      this.confirmEmail();
    } else {
      this.register();
    }
  }

  confirmEmail(): void {
    if (this.token) {
      this.registrationService.setLoadingState(true);
      this.registrationService.confirmEmail(this.token).pipe(delay(5000)).subscribe(
        response => {
          this.registrationService.setLoadingState(false);
          this.registrationService.clearFormData();
          this.registrationService.clearToken();
        },
        error => {
          this.registrationService.setLoadingState(false);
        }
      );
    }
  }

  register(): void {
    const url = window.location.href;
    this.registrationService.register(url).subscribe(
      response => {
        console.log(response);
      },
      error => {
      }
    );
  }
}

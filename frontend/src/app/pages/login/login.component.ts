import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  private socialAuthService = inject(SocialAuthService);
  password: string = ''; // Bind password value
  showPassword: boolean = false; // Flag to toggle visibility

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Toggle the visibility flag
  }
  ngOnInit(): void {
    this.socialAuthService.authState.subscribe(response => {
      console.log(response);
    })
  }
}

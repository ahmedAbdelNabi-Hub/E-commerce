import { SocialAuthService } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
confirm2($event: MouseEvent) {
throw new Error('Method not implemented.');
}
confirm1($event: MouseEvent) {
throw new Error('Method not implemented.');
}
  visible: any;
  showDialog() {
    console.log('show dialog');
  }
  private socialAuthService = inject(SocialAuthService);
  password: string = '';
  showPassword: boolean = false;
  private _http = inject(HttpClient);

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe(response => {
      console.log(response);
    })
  }

}

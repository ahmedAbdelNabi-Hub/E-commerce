import {Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../core/services/Auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  animationState: string = '';
  _registerService = inject(AuthService);
  contentRightForm = signal<string[]>([]);


  ngOnInit(): void {
    this.onActivate();
    this._registerService.setDefContent();
    this.getContent();
  }

  onActivate() {
    this.animationState = 'activated';
  }

  getContent(): void {
    this._registerService.containtIsChange$.subscribe(data => {
      this.contentRightForm.set(data);
    })
  }

}

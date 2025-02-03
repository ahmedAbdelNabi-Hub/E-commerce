import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { RegistrationService } from '../../core/services/registration.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  animationState: string = '';
  _registerService = inject(RegistrationService);
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

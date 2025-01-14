import { Component } from '@angular/core';
import { routingAnimation } from '../shared/animations/RouteAnimation';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  animations: [routingAnimation],
})
export class AdminComponent {
  animationState: string = '';

  onActivate() {
    setTimeout(() => {
      this.animationState = '';
      setTimeout(() => {
        this.animationState = 'activated';
      }, 0);
    }, 0);
  }
  
}

import { Component } from '@angular/core';
import { AnimationOpcity, routingAnimation } from '../../shared/animations/RouteAnimation';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
  animations : [routingAnimation,AnimationOpcity]
})
export class AccountComponent {
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

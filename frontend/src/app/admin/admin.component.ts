import { Component } from '@angular/core';
import { routeAnimations } from '../shared/animations/RouteAnimation';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  animations :[routeAnimations]
})
export class AdminComponent {

}

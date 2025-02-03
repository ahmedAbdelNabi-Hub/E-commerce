import { Component } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';
import { routingAnimation } from '../shared/animations/RouteAnimation';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  animations: [routingAnimation],
})
export class AdminComponent {
  constructor(private contexts: ChildrenOutletContexts) {}

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}

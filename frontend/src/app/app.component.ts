import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { routeAnimations, routingAnimation } from './shared/animations/RouteAnimation';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations:[routingAnimation,routeAnimations]
})
export class AppComponent {
  getRouteAnimation(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  showNavbar: boolean = false;

  constructor(private router: Router) {
    // Subscribe to router events to check for NavigationEnd
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Check if the current route is for the admin module
      this.showNavbar = event.url.includes('/admin'); // Adjust the condition as necessary
    });
  }
}

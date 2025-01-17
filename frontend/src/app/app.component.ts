import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { routeAnimations, routingAnimation } from './shared/animations/RouteAnimation';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [routingAnimation, routeAnimations]
})
export class AppComponent {
  getRouteAnimation(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
  showNavbar: boolean = false;
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showNavbar = ['/login', '/register', '/forgot-password', '/admin'].some(path =>
        event.url.includes(path)
      );
    });
  }
}

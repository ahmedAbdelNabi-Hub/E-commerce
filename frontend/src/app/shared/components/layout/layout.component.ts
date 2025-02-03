import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { routingAnimation } from '../../animations/RouteAnimation';
import { filter } from 'rxjs';
import { fadeInOut } from '../../animations/fadeInOut';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  animations: [routingAnimation]
})
export class LayoutComponent implements OnInit {
  showNavbar: boolean = false;

  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    this.route.firstChild?.data.subscribe((data) => {
      console.log('Data from resolver in child route:', data);
      this.showNavbar = data['showNavbar'];
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showNavbar = ['/login', '/auth', '/forgot-password', '/admin'].some(path =>
        event.url.includes(path) ? false:true
      );
    });
  }

  getRouteAnimation(outlet: RouterOutlet) {
      return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    }
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

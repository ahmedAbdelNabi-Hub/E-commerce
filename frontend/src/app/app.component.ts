import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AnimationOpcity } from './shared/animations/RouteAnimation';
import { filter, Subject, takeUntil } from 'rxjs';
import { NavbarService } from './core/services/navbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],  // Corrected styleUrl to styleUrls
  animations: [AnimationOpcity],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private router: Router) { }
  navbarStateService = inject(NavbarService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.changeRoute();
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.changeRoute();
      }
    });
  }

  changeRoute() {
    this.navbarStateService.setNavbarVisibility(false);
    const initialRoute = window.location.pathname;
    const shouldHideNavbar = this.navbarStateService.isRouteExcluded(initialRoute);
    this.navbarStateService.setNavbarVisibility(!shouldHideNavbar);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

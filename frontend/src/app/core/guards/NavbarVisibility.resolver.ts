import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { NavbarService } from '../services/navbar.service';

@Injectable({
  providedIn: 'root',
})

export class NavbarVisibilityResolver implements CanActivate {
  constructor(private navbarService: NavbarService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const excludedRoutes = ['/auth/login', '/login', '/auth/create/account', '/signUp', '/forgot-password', '/admin'];
    const currentUrl = window.location.pathname;
    const showNavbar = !excludedRoutes.some(path => currentUrl.startsWith(path));
    this.navbarService.updateNavbarVisibility(showNavbar);
    if (showNavbar == false) {
      if (currentUrl.startsWith('/auth/login')) {
        return true;
      }
      else {
        return this.router.navigate(['']);
      }
    } else {
      return true;
    }
    return false;
  }
}
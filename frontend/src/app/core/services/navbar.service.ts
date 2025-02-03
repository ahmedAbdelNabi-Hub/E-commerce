import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { Navbar } from '../models/interfaces/navbar.model';
import { API_URLS } from '../constant/api-urls';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  constructor(private http: HttpClient) { }
  private navbarVisibleSubject = new BehaviorSubject<boolean>(true);
  navbarVisible$ = this.navbarVisibleSubject.asObservable();

  excludedRoutes = [
    '/auth/login',
    '/login',
    '/auth/create/account',
    '/signUp',
    '/forgot-password',
    '/admin',
    '/unKonwPage'
  ];
  setNavbarVisibility(visible: boolean): void {
    this.navbarVisibleSubject.next(visible);
  }

  isRouteExcluded(route: string): boolean {
    return this.excludedRoutes.some((excludedRoute) => route.startsWith(excludedRoute));
  }
  getNavbars(): Observable<Navbar[]> {
    return this.http.get<Navbar[]>(`https://localhost:7197${API_URLS.navbar}`).pipe(
      catchError(error => {
        // Handle error appropriately
        console.error('Error fetching navbars', error);
        return of([]); // Return an empty array or handle the error as needed
      })
    );
  }
  private showNavbarSubject = new BehaviorSubject<boolean>(true);  // default to `true` for navbar visibility
  public showNavbar$ = this.showNavbarSubject.asObservable();  // Expose observable for component subscription

  // Method to update navbar visibility
  updateNavbarVisibility(visible: boolean) {
    this.showNavbarSubject.next(visible);
  }
}
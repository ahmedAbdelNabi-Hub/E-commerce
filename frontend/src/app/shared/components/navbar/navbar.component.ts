import { Component, OnInit, OnDestroy, Renderer2, inject } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Navbar } from '../../../core/models/interfaces/navbar.model';
import { NavbarService } from '../../../core/services/navbar.service';
import { sidebarAnimation } from '../../animations/sidebarAnimation';
import { BasketService } from '../../../core/services/shipping/Basket.service';
import { Perform } from '../../../core/models/classes/Perform';
import { IBasket } from '../../../core/models/interfaces/Basket/IBasket';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [sidebarAnimation]
})
export class NavbarComponent implements OnInit, OnDestroy {
  isOpenSideBar: boolean = false;
  Navbars: Navbar[] = [];
  private navbarSubscription!: Subscription;
  _basketService = inject(BasketService);
  private readonly navbarService = inject(NavbarService);
  constructor(private renderer: Renderer2) { }
  ngOnInit(): void {
    this.loadNavbars();
  }

  private loadNavbars(): void {
    this.navbarSubscription = this.navbarService.getNavbars().pipe(
      tap(response => {
        this.Navbars = response;
        console.log("nav",response)
      }),
      catchError(error => {
        console.error('Error fetching navbars:', error);
        return of([]); 
      })
    ).subscribe();
  }

  trackByFn(index: number, item: Navbar): number {
    return item.id;
  }

  toggleSidebar(): void {
    this.isOpenSideBar = !this.isOpenSideBar;
    if (this.isOpenSideBar) {
      this.renderer.addClass(document.body, 'no-scroll');
    } else {
      this.renderer.removeClass(document.body, 'no-scroll');
    }
  }

  ngOnDestroy(): void {
    this.navbarSubscription?.unsubscribe();
  }

  closeSidebar(): void {
    this.isOpenSideBar = false;
    this.renderer.removeClass(document.body, 'no-scroll');
  }

}

import { Component, OnInit, OnDestroy, Renderer2, inject, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import {  Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Navbar } from '../../../core/models/interfaces/navbar.model';
import { NavbarService } from '../../../core/services/navbar.service';
import { sidebarAnimation } from '../../animations/sidebarAnimation';
import { BasketService } from '../../../core/services/shipping/Basket.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [sidebarAnimation]
})
export class NavbarComponent implements OnInit, OnDestroy, OnChanges {
  isOpenSideBar: boolean = false;
  Navbars = signal<Navbar[]>([]);
  @Input("hiddenItem") hiddenItem: boolean = true;
  private navbarSubscription!: Subscription;
  _basketService = inject(BasketService);
  private readonly navbarService = inject(NavbarService);
  constructor(private renderer: Renderer2) { }
  ngOnInit(): void {
    this.loadNavbars();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hiddenItem']) {
      this.hiddenItem = this.hiddenItem;
    }
  }
  private loadNavbars(): void {
    this.navbarSubscription = this.navbarService.getNavbars().pipe(
      tap(response => {
        this.Navbars.set(response);
      }),
      catchError(error => {
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

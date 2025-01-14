import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HoverToggleMenuDirective } from './directives/hover-toggle-menu.directive';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MenuComponent } from './components/navbar/components/menu/menu.component';
import { OwlCarouselComponent } from './components/owl-carousel/owl-carousel.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ProductCardWithDiscoundComponent } from './components/card/product-card-with-discound/product-card-with-discound.component';
import { SearchComponent } from './components/navbar/components/search/search.component';
import { CategoryCardComponent } from './components/card/category-card/category-card.component';
import { AddToCartComponent } from './components/buttons/add-to-cart/add-to-cart.component';
import { LazyLoadComponentDirective } from './directives/lazy-load-component.directive';
import { SidebarMobileComponent } from './components/navbar/components/sidebar-mobile/sidebar-mobile.component';
import { DropdownComponent } from './components/buttons/dropdown/dropdown.component';
import { AccordionComponent } from './components/buttons/accordion/accordion.component';
import { FormsModule } from '@angular/forms';
import { CountdownTimerComponent } from './components/countdown-timer/countdown-timer.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { DashboardCardComponent } from './components/card/dashboard-card/dashboard-card.component';
import { AdminHeaderComponent } from './components/header/admin-header/admin-header.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonWithIconComponent } from './components/buttons/button-with-icon/button-with-icon.component';
import { LoadingComponent } from './components/loading/loading.component';
import { MessageHandlerComponent } from './components/message-handler/message-handler.component';
import { TagNavigationComponent } from './components/tag-navigation/tag-navigation.component';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';

@NgModule({
  declarations: [
    NavbarComponent,
    MenuComponent,
    HoverToggleMenuDirective,
    OwlCarouselComponent,
    SearchComponent,
    ProductCardWithDiscoundComponent,
    CategoryCardComponent,
    AddToCartComponent,
    LazyLoadComponentDirective,
    SidebarMobileComponent,
    DropdownComponent,
    AccordionComponent,
    CountdownTimerComponent,
    AdminSidebarComponent,
    DashboardCardComponent,
    AdminHeaderComponent,
    ButtonWithIconComponent,
    LoadingComponent,
    MessageHandlerComponent,
    TagNavigationComponent,
    ImageUploaderComponent,

  ],
  imports: [
    CommonModule,
    PanelMenuModule,
    RouterModule, CarouselModule, FormsModule
  ],
  exports: [MessageHandlerComponent,
    CountdownTimerComponent,
    TagNavigationComponent,
    NavbarComponent,
    SearchComponent,
    ImageUploaderComponent,
    ProductCardWithDiscoundComponent,
    DropdownComponent,
    AdminSidebarComponent,
    CategoryCardComponent,
    DashboardCardComponent,
    LazyLoadComponentDirective,
    AdminHeaderComponent,
    ButtonWithIconComponent,
    LoadingComponent,
    MenuComponent, HoverToggleMenuDirective, OwlCarouselComponent]
})
export class SharedModule { }
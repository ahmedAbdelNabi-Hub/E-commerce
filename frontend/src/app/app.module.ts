import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { SharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { AdvertisementCarouselComponent } from './pages/home/components/advertisement-carousel/advertisement-carousel.component';
import { ProductOffersComponent } from './pages/home/components/product-offers/product-offers.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollSpyDirective } from './shared/directives/ScrollSpy.directive';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdvertisementCarouselComponent,
    ProductOffersComponent,
    ScrollSpyDirective,


 
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    CarouselModule,
  ],
  providers: [
    provideHttpClient(),
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    // No need for provideClientHydration here
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }

import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, HostListener, Inject, OnInit, OnDestroy, PLATFORM_ID, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ImageSlider } from '../../../../core/models/interfaces/ImageSlider';
import { HoverService } from '../../../../core/services/hover.service';
import { ImageSliderService } from '../../../../core/services/imageSlider.service';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-advertisement-carousel',
  templateUrl: './advertisement-carousel.component.html',
  styleUrls: ['./advertisement-carousel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvertisementCarouselComponent implements AfterViewInit, OnInit, OnDestroy {
  isBrowser: boolean;
  intervalId: any;
  activeIndex: number = 0;
  startX: number = 0;
  isHovered: boolean = false;
  isPaused: boolean = false;
  activeTitle: string = '';
  imageMovingTime: number = 5000;
  isSmallScreen: boolean = false;

  imageSlider: ImageSlider[] = [];
  private hoverSubscription!: Subscription;
  private destroy$ = new Subject<void>();

  constructor(
    private imageSliderService: ImageSliderService,
    @Inject(PLATFORM_ID) platformId: object,
    private hoverService: HoverService,
    private _ChangeDetectorRef: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.isSmallScreen = this.isBrowser && window.innerWidth < 630;
  }

  ngOnInit(): void {
    
    this.imageSliderService.getImageSlider().pipe(
      tap(response => {
        this.imageSlider = response;
        if (this.imageSlider.length > 0) {
          this.activeTitle = this.imageSlider[0]?.title;
          this._ChangeDetectorRef.markForCheck();

          if (this.isBrowser) {
            this.startAutoSlide();
          }
        }
      }),
      catchError(error => {
        console.error('Error fetching image slider:', error);
        return of([]); // Return an empty array on error
      }),
      takeUntil(this.destroy$) // Clean up the subscription
    ).subscribe();

    this.hoverSubscription = this.hoverService.hoverState$.subscribe(isHovered => {
      this.isHovered = isHovered;
    });
  }

  ngAfterViewInit(): void {
    // Auto-slide is handled in ngOnInit once data is fetched
  }

  startAutoSlide(): void {
    if (!this.isPaused) {
      this.intervalId = setInterval(() => {
        this.nextImage()
        this._ChangeDetectorRef.markForCheck();
      }, this.imageMovingTime);
      this._ChangeDetectorRef.detectChanges();

    }
  }

  pauseSlide(): void {
    this.isPaused = true;
    clearInterval(this.intervalId);
  }

  playSlide(): void {
    this.isPaused = false;
    this.startAutoSlide();
  }

  onTouchStart(event: TouchEvent): void {
    this.startX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    const endX = event.changedTouches[0].clientX;
    const diffX = this.startX - endX;

    if (Math.abs(diffX) > 50) {
      diffX > 0 ? this.nextImage() : this.prevImage();
    }
  }

  prevImage(): void {
    this.activeIndex = (this.activeIndex === 0) ? (this.imageSlider.length - 1) : (this.activeIndex - 1);
    this.updateActiveTitle();
  }

  nextImage(): void {
    if (this.imageSlider.length > 0) {
      this.activeIndex = (this.activeIndex + 1) % this.imageSlider.length;
      this.updateActiveTitle();
    }
  }

  activeImage(index: number): void {
    this.activeIndex = index;
    this.updateActiveTitle();
  }

  private updateActiveTitle(): void {
    this.activeTitle = this.imageSlider[this.activeIndex]?.title;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isSmallScreen = this.isBrowser && window.innerWidth < 605;
  }

  getImage(image: ImageSlider): string {
    return this.isSmallScreen ? image.smallImage : image.largeImage;
  }

  trackByFn(index: number, item: ImageSlider): number {
    return item.id;
  }
  ngOnDestroy(): void {
    this.pauseSlide();
    this.hoverSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

}

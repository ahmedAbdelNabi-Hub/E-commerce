import { Directive, ElementRef, Renderer2, HostListener, AfterViewInit } from '@angular/core';
import { HoverService } from '../../core/services/hover.service';

@Directive({
  selector: '[appHoverToggleMenu]'
})
export class HoverToggleMenuDirective implements AfterViewInit {
  private menu!: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2, private hoverService: HoverService) {}
  ngAfterViewInit() {
    this.menu = this.el.nativeElement.querySelector('app-menu');
  }

  @HostListener('mouseenter') onMenuMouseEnter() {
    if (this.menu) {
      this.renderer.setStyle(this.menu, 'max-height', '400px');
      this.hoverService.setHoverState(true);
    }
  }

  @HostListener('mouseleave') onMenuMouseLeave() {
    if (this.menu) {
      this.renderer.setStyle(this.menu, 'max-height', '0px');
      this.hoverService.setHoverState(false);
    }
  }
}

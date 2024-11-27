import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[scroll-spy]'
})
export class ScrollSpyDirective {
  @Output() scrolled = new EventEmitter<number>();  

  constructor() {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;  
    this.scrolled.emit(scrollPosition);  
  }
}

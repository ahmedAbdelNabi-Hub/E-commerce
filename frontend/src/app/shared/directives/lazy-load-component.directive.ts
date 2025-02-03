import { Directive, ElementRef, Input, ViewContainerRef, ComponentFactoryResolver, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appLazyLoadComponent]'
})
export class LazyLoadComponentDirective implements AfterViewInit {

  @Input('appLazyLoadComponent') componentToLoad: any; // Pass the component to be loaded

  constructor(
    private el: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngAfterViewInit() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadComponent();
          observer.disconnect(); // Stop observing after the component is loaded
        }
      });
    });

    observer.observe(this.el.nativeElement);
  }

  private loadComponent() {
    // Dynamically load the component passed to the directive
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.componentToLoad);
    this.viewContainerRef.clear();
    this.viewContainerRef.createComponent(componentFactory);
  }
}

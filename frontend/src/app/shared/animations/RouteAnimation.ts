import { trigger, transition, style, animate, query, group } from '@angular/animations';


export const routingAnimation = trigger('routingAnimation', [
    transition('*<=>*', [style({ opacity: 0, transform: 'translateY(-10px)' }), animate('300ms', style({ opacity: 1, transform: 'translateY(0px)' }))]),
])

export const AnimationOpcity = trigger('AnimationOpcity', [
    transition('*<=>*', [style({ opacity: 0, transform: 'translateX(0px)' }), animate('400ms', style({ opacity: 1, transform: 'translateX(0px)' }))]),
])

export const DeleteAnimation = trigger('DeleteAnimation', [
    transition('*<=>*', [style({ opacity: 0, transform: 'translateX(100px)' }), animate('300ms', style({ opacity: 1, transform: 'translateX(140px)' }))]),
])

export const routingcenterAnimation = trigger('routingcenterAnimation', [
    transition('*<=>*', [style({ opacity: 0, transform: 'translateX(0px)' }), animate('300ms', style({ opacity: 1, transform: 'translateX(0px)' }))]),
])








// Define animations
export const routeAnimations = trigger('routeAnimations', [
  // Transition for route changes
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        opacity: 0
      })
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0 })
    ], { optional: true }),
    
    // Animate both leaving and entering components in parallel
    group([
      query(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        animate('300ms ease-out', style({ opacity: 1 }))
      ], { optional: true })
    ])
  ])
]);

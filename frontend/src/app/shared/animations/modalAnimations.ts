import { animate, style, transition, trigger } from '@angular/animations';

export const modalAnimations = {
  fadeInOut: trigger('fadeInOut', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('300ms ease-out', style({ opacity: 1 }))
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ opacity: 0 }))
    ])
  ]),

  slideUpDown: trigger('slideUpDown', [
    transition(':enter', [
      style({ transform: 'translateY(20px)', opacity: 0 }),
      animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ transform: 'translateY(20px)', opacity: 0 }))
    ])
  ])
};

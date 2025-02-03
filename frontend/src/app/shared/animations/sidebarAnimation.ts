import { trigger, state, style, transition, animate } from '@angular/animations';

export const sidebarAnimation = trigger('sidebarAnimation', [
  transition(':enter', [  // When the element enters
    style({
      opacity: 0
    }),
    animate('0.3s ease-in-out', style({
      opacity: 1
    }))
  ]),
  transition(':leave', [  // When the element leaves
    animate('0.3s ease-in-out', style({
      opacity: 0
    }))
  ])
]);

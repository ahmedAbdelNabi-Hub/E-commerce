import { trigger, transition, style, animate, group, query, keyframes } from '@angular/animations';

export const imageAnimation = trigger('imageAnimation', [
    transition(':enter', [
      style({ transform: 'translateX(100%)', opacity: 0 }), // Start off-screen to the right
      animate(
        '600ms ease-out',
        style({ transform: 'translateX(0)', opacity: 1 }) // Slide into place
      )
    ]),
    transition(':leave', [
      animate(
        '550ms',
        style({ transform: 'translateX(-100%)', opacity: 0 }) // Slide out to the left
      )
    ])
  ]);
  export const contentAnimation = trigger('contentAnimation', [
    transition(':enter', [
      style({ transform: 'translateX(100%)', opacity: 0 }), // Start off-screen to the right
      animate(
        '550ms 200ms ease-out', // Add a slight delay to start after the image
        style({ transform: 'translateX(0)', opacity: 1 }) // Slide into place
      )
    ]),
    transition(':leave', [
      animate(
        '550ms ease-in',
        style({ transform: 'translateX(-100%)', opacity: 0 }) // Slide out to the left
      )
    ])
  ]);
  export const paginationAnimation = trigger('paginationAnimation', [
    transition(':enter', [
      animate(
        '350ms ease-out',
        keyframes([
          style({  opacity: 0, offset: 0 }),
          style({  opacity: 0.7, offset: 0.8 }),
          style({ opacity: 1, offset: 1 })
        ])
      )
    ]),
    transition(':leave', [
      animate(
        '300ms ease-in',
        style({  opacity: 0 }) // Slide out with fade
      )
    ])
  ]);
  
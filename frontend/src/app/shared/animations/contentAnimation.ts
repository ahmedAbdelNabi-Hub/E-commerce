import { trigger, transition, style, animate, group, query } from '@angular/animations';

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
        '600ms ease-in',
        style({ transform: 'translateX(-100%)', opacity: 0 }) // Slide out to the left
      )
    ])
  ]);
  export const contentAnimation = trigger('contentAnimation', [
    transition(':enter', [
      style({ transform: 'translateX(100%)', opacity: 0 }), // Start off-screen to the right
      animate(
        '600ms 200ms ease-out', // Add a slight delay to start after the image
        style({ transform: 'translateX(0)', opacity: 1 }) // Slide into place
      )
    ]),
    transition(':leave', [
      animate(
        '600ms ease-in',
        style({ transform: 'translateX(-100%)', opacity: 0 }) // Slide out to the left
      )
    ])
  ]);
  
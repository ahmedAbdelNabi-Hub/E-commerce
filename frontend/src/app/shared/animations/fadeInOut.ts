import { animate, style, transition, trigger } from "@angular/animations";

export const fadeInOut = trigger('fadeInOut', [
    transition(':enter', [  // Enter animation
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' })),
    ]),
    transition(':leave', [  // Leave animation
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(-20px)' })),
    ]),
])
import { animate, style, transition, trigger } from "@angular/animations";

export const transformAnimation = trigger('transformAnimation', [
    // Transition for the element entering
    transition(':enter', [
        style({ opacity: 0, transform: 'translateY(100%) scale(0.8)' }), // Start below the screen with a smaller size
        animate('0.2s ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' })) // Fade in and move to its normal position
    ]),

    // Transition for the element leaving
    transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0) scale(1)' }), // Start at the normal position
        animate('0.2s ease-in', style({ opacity: 0, transform: 'translateY(100%) scale(0.8)' })) // Fade out and move below with a smaller size
    ])
]);

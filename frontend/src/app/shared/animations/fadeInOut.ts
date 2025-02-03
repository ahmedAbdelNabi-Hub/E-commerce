import { animate, style, transition, trigger } from "@angular/animations";

export const fadeInOut = trigger("fadeInOut", [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('210ms ease-in-out', style({ opacity: 1 }))
    ]),
    transition(':leave', [
        animate('150ms ease-in-out', style({ opacity: 0 }))
    ])
]);

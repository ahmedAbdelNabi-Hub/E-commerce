import { trigger, style, transition, animate } from '@angular/animations';

export const lineAnimation = trigger('progressBar', [
    transition(':enter', [
        style({ width: '0%' }),
        animate('20s ease-in-out', style({ width: '100%' })),
    ]),
    transition(':leave', [
        animate('1s ease-out', style({ width: '0%' })),
    ]),
])
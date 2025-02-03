import { trigger, transition, style, animate, query, group, animateChild } from '@angular/animations';

export const routingAnimation = trigger('routingAnimation', [
  transition('* <=> *', [
    style({ opacity: 0, transform: 'translateY(-40px)' }),
    animate('300ms', style({ opacity: 1, transform: 'translateY(0px)' }))
  ])
]);


export const AnimationOpcity = trigger('AnimationOpcity', [
  transition('*<=>*', [style({ opacity: 0, transform: 'translateX(0px)' }), animate('200ms', style({ opacity: 1, transform: 'translateX(0px)' }))]),
])



export const moveLeftToRight = trigger('moveLeftToRight', [
  transition('* <=> *', [
    style({ transform: 'translateX(100%)' }),  // Start from left
    animate('500ms linear', style({ transform: 'translateX(0%)' }))  // Move to normal position
  ])
]);

// Animation for leaving from right to left
export const moveRightToLeft = trigger('moveRightToLeft', [
  transition('* <=> *', [
    style({ transform: 'translateX(-100%)' }),  // Start from right
    animate('500ms linear', style({ transform: 'translateX(0%)' }))  // Move to normal position
  ])
]);
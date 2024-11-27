import { Component, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MenuLink, Menu } from '../../../../core/models/interfaces/navbar.model'; // Adjust the path as needed

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css'],
  animations: [
    trigger('panelAnimation', [
      state('void', style({ height: '0', opacity: 0 })),
      state('*', style({ height: '*', opacity: 1 })),
      transition('void => *', [
        animate('300ms ease-out') // Duration for opening animation
      ]),
      transition('* => void', [
        animate('300ms ease-in') // Duration for closing animation
      ])
    ])
  ]
})
export class AccordionComponent {
  @Input('menu') menu!: Menu; 

  openIndex: number | null = null;

  togglePanel(index: number) {
    this.openIndex = this.openIndex === index ? null : index; 
  }
}

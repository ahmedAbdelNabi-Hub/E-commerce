import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { routingAnimation } from '../../animations/RouteAnimation';
import { filter } from 'rxjs';
import { fadeInOut } from '../../animations/fadeInOut';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  animations: [
    trigger('dropdownAnimation', [
      state('closed', style({
        height: '0',
        opacity: 0,
        visibility: 'hidden',
      })),
      state('open', style({
        height: '*',
        opacity: 1,
        visibility: 'visible',
      })),
      transition('closed <=> open', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})

export class LayoutComponent {
  dropdownState: string = 'closed';

  toggleDropdown() {
    this.dropdownState = this.dropdownState === 'closed' ? 'open' : 'closed';
  }

}

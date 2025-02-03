import { Component, Input } from '@angular/core';
import { Menu, MenuLink } from '../../../../core/models/interfaces/navbar.model';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent {
 @Input('links') Links !: MenuLink[];
 @Input('menu') menu!: Menu ;
  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: any) {
    this.menu = option;
    this.isOpen = false;
  }
}

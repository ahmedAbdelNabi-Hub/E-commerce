import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Navbar } from '../../../../../core/models/interfaces/navbar.model';
import { sidebarAnimation } from '../../../../animations/sidebarAnimation';

@Component({
  selector: 'app-sidebar-mobile',
  templateUrl: './sidebar-mobile.component.html',
  styleUrl: './sidebar-mobile.component.css',
  animations: [sidebarAnimation]
})
export class SidebarMobileComponent {
  isOpen: boolean = false;
  @Input('Navbar') Navbar: Navbar[] = [];
  @Output() closeSidebar = new EventEmitter<void>();
  navberWithIndex!: Navbar;

  constructor() { }

  getNavberWithIndex(index: number): void {
    this.navberWithIndex = this.Navbar[index];
    if (this.navberWithIndex.menus.length != 0) {
      this.isOpen = true;
    }
    else {
      this.isOpen = false;
    }
  }
  
  close():void{
    this.closeSidebar.emit();
  }
}

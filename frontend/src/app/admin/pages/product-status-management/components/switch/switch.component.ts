import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.css'
})
export class SwitchComponent {
  @Input("isActive") IsActive = false;
  
  toggleSwitch(): void {
    this.IsActive = !this.IsActive;
  }
  
}

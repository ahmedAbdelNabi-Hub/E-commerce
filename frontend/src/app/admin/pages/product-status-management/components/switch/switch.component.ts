import { Component } from '@angular/core';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.css'
})
export class SwitchComponent {
  isOn = false;

  toggleSwitch(): void {
    this.isOn = !this.isOn;
  }

  
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
  
}

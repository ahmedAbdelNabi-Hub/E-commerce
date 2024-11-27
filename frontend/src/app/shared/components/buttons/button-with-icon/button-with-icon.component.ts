import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-with-icon',
  templateUrl: './button-with-icon.component.html',
  styleUrl: './button-with-icon.component.css'
})
export class ButtonWithIconComponent {
  @Input('icon') icon!: string; // Icon class name
  @Input('label') label!: string; // Button label
  @Input('padding') padding: string = 'px-5 py-1.5'; // Default padding
  @Input('color') color: string = 'text-black'; // Default text color
  @Input('bg-color') bgColor: string = 'bg-white'; // Default background color
}
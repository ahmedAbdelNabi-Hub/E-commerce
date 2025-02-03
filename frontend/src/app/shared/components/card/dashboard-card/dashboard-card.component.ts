import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.css'
})
export class DashboardCardComponent {
  @Input("label") label!: string ;  
  @Input("amount") amount: number = 0;                   // Amount to display
  @Input("currency") currency: string = 'ج.م';             // Currency symbol
  @Input("percentageChange") percentageChange: number = 0;         // Percentage change
  @Input("isPositiveChange") isPositiveChange: boolean = true;     // Determines trend icon and color
}

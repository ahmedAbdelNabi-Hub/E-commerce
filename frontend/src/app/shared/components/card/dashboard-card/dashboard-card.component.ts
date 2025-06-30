import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.css'
})
export class DashboardCardComponent {
  @Input("label") label!: string ;  
  @Input("amount") amount: number = 0;                 
  @Input("currency") currency: string = 'ج.م';             
  @Input("percentageChange") percentageChange: number = 0;       
  @Input("isPositiveChange") isPositiveChange: boolean = true; 
  @Input("icon") icon: string = ''; 
  @Input("isLoading") isLoading :boolean=true; 
  
}

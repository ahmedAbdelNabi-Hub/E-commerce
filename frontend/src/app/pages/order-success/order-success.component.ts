import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.css'
})
export class OrderSuccessComponent {
  sessionId: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.sessionId = params.get('session_id');
      console.log('Session ID:', this.sessionId);
      setTimeout(() => {
        this.router.navigate(['/account']); 
      }, 4000);
    });
  }
}

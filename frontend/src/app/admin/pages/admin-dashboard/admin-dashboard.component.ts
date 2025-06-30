import { DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ChartData } from '../../../core/models/interfaces/IChartData';
import { Perform } from '../../../core/models/classes/Perform';
import { delay, Subject, takeUntil } from 'rxjs';

interface RecentOrder {
  customerName: {
    firstName: string;
    lastName: string;
  };
  email: string;
  itemImages: string[];
  orderId: string;
  status: 'Completed' | 'Pending';
  date: string;
  items: number;
  total: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  providers: [DatePipe]

})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  icons: string[] = ["<i class='bx bx-credit-card-alt text-[#4a5654] text-[22px]'></i>",
    "<i class='bx bxs-user-circle text-[#4a5654] text-[22px]'></i>"
    , "<i class='bx bxs-truck text-[#4a5654] text-[22px]'></i>",
    "<i class='bx bxs-component text-[#4a5654] text-[22px]'></i>"
  ];

  recentOrders: RecentOrder[] = [
    {
      customerName: {
        firstName: 'John',
        lastName: 'Doe'
      },
      email: 'john.doe@example.com',
      itemImages: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1572635196184-84e35138cf62?q=80&w=1000&auto=format&fit=crop'
      ],
      orderId: 'ORD001',
      status: 'Completed',
      date: '2024-03-20',
      items: 3,
      total: 299.99
    },
    {
      customerName: {
        firstName: 'Jane',
        lastName: 'Smith'
      },
      email: 'jane.smith@example.com',
      itemImages: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1000&auto=format&fit=crop'
      ],
      orderId: 'ORD002',
      status: 'Pending',
      date: '2024-03-19',
      items: 2,
      total: 149.99
    },
    {
      customerName: {
        firstName: 'Mike',
        lastName: 'Johnson'
      },
      email: 'mike.johnson@example.com',
      itemImages: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1000&auto=format&fit=crop'
      ],
      orderId: 'ORD003',
      status: 'Completed',
      date: '2024-03-18',
      items: 5,
      total: 499.99
    }
  ];
  dashboardApi = new Perform<ChartData>();
  private dashboardService = inject(DashboardService);
  chartData = signal<ChartData | null>(null);
  private destroy$ = new Subject<void>();
  ngOnInit(): void {
    this.dashboardApi.load(this.dashboardService.getChartData());
    this.dashboardApi.data$.pipe(takeUntil(this.destroy$)).subscribe(
      response => {
        this.chartData.set(response!)
        console.log(response)
      }
    )
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.dashboardApi.unsubscribe();
  }
}
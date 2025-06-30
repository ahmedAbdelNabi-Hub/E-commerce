import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { IGroupedStatuses, IStatus } from '../../../core/models/interfaces/IStatus';
import { StatusService } from '../../../core/services/Status/status.service';
import { Perform } from '../../../core/models/classes/Perform';
import { share, tap } from 'rxjs/operators';
import { transformAnimation } from '../../../shared/animations/transformAnimation';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-status-management',
  templateUrl: './product-status-management.component.html',
  styleUrls: ['./product-status-management.component.css'],
  animations: [transformAnimation]
})
export class ProductStatusManagementComponent implements OnInit, OnDestroy {
  statuses = signal<IStatus[] | null>(null);
  selectedStatusId!: number;
  private perform: Perform<IStatus[]>;
  private isLoading = false;

  constructor(private statusService: StatusService) {
    this.perform = new Perform<IStatus[]>();
  }

  ngOnInit(): void {
    this.loadStatuses();
  }

  loadStatuses(): void {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.perform.load(this.statusService.getStatuses());
     this.perform.data$.pipe(
      tap(data => {
        if (data) {
          this.statuses.set(data);
          this.isLoading = false;
          this.selectedStatusId = data[0].id;
        }
      })
    ).subscribe();
  }

  handleStatusSelection(statusId: number): void {
    this.selectedStatusId = statusId;
  }

  ngOnDestroy(): void {
    this.perform.unsubscribe();
  }
}
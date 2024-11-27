import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { IGroupedStatuses, IStatus } from '../../../core/models/interfaces/IStatus';
import { StatusService } from '../../../core/services/Status/status.service';
import { Perform } from '../../../core/models/classes/Perform';
import { tap } from 'rxjs';
import { groupStatuses } from '../../../core/utils/groupedStatuses ';
import { routeAnimations } from '../../../shared/animations/RouteAnimation';
import { fadeInOut } from '../../../shared/animations/fadeInOut';
import { transformAnimation } from '../../../shared/animations/transformAnimation';

@Component({
  selector: 'app-product-status-management',
  templateUrl: './product-status-management.component.html',
  styleUrl: './product-status-management.component.css',
  animations:[transformAnimation]
})
export class ProductStatusManagementComponent implements OnInit, OnDestroy {
  statuses = signal<IStatus[] | null>(null);
  statusesService = inject(StatusService);
  preform = new Perform<IStatus[]>();
  groupedStatuses: IGroupedStatuses = { admin: [], system: [] };
  statusId!:number;
  ngOnInit(): void {
    this.loadStatuses();
  }

  loadStatuses(): void {
    this.preform.load(this.statusesService.getStatuses());
    this.preform.data$.pipe(
      tap(data => {
        if (data) {
          console.log('Loaded statuses:', data); // Debug log
          this.statuses.set(data);
          // Group statuses once data is loaded
          this.groupedStatuses = groupStatuses(this.statuses()!);
        }
      })
    ).subscribe();
  }
 
  handleStatusSelection(statusId: number){
        this.statusId=statusId;
  }
 
  ngOnDestroy(): void {
    this.preform.unsubscribe();
  }
}

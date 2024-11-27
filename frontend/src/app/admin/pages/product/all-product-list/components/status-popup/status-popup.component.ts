import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { StatusService } from '../../../../../../core/services/Status/status.service';
import { fadeInOut } from '../../../../../../shared/animations/fadeInOut';
import { Perform } from '../../../../../../core/models/classes/Perform';
import { IGroupedStatuses, IStatus } from '../../../../../../core/models/interfaces/IStatus';
import { tap } from 'rxjs';
import { MessageService } from '../../../../../../core/services/Message.service';
import { groupStatuses } from '../../../../../../core/utils/groupedStatuses ';

@Component({
  selector: 'app-status-popup',
  templateUrl: './status-popup.component.html',
  styleUrl: './status-popup.component.css',
  animations: [fadeInOut]
})
export class StatusPopupComponent implements OnInit ,OnDestroy {
  statusService = inject(StatusService);
  isStatusPopupVisible = signal<boolean>(false);
  preform = new Perform<IStatus[]>();
  prefromWithNotResponse = new Perform<any>();
  statuses = signal<IStatus[]>([]);
  statuseIsChooes: number=0;
  activeIndex !:number | undefined;
  private messageHandelr = inject(MessageService)
  groupedStatuses: IGroupedStatuses = { admin: [], system: [] };

  ngOnInit(): void {
    this.statusService.isStatusPopupVisible$.subscribe(response => {
      this.isStatusPopupVisible.set(response);
    })
    this.loadStatuses();
    this.groupedStatuses=groupStatuses(this.statuses());
    console.log(this.groupedStatuses.admin)
    console.log(this.groupedStatuses.system)
  }
  loadStatuses(): void {
    this.preform.load(this.statusService.getStatuses());
    this.preform.data$.pipe(
      tap(data => {
        if (data) {
          console.log('Loaded statuses:', data); // Debug log
          this.statuses.set(data);
  
          // Group statuses once data is loaded
          this.groupedStatuses = groupStatuses(this.statuses());
          console.log('Admin statuses:', this.groupedStatuses.admin);
          console.log('System statuses:', this.groupedStatuses.system);
        }
      })
    ).subscribe();
  }
  
  

  hidePopup(): void {
    this.isStatusPopupVisible.set(false);
    this.statuseIsChooes=0;
    this.activeIndex=undefined;
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  selectStatus(statusId: number,activeIndex:number): void {
    this.statuseIsChooes = statusId;
    this.activeIndex=activeIndex;
    console.log(this.statuseIsChooes);
  }
  assignStatusToProduct():void{
     this.prefromWithNotResponse.load(this.statusService.AssignStatus(this.statuseIsChooes).pipe(
      tap((response:any)=>{
        if(response){
          this.messageHandelr.showSuccess("Product has been successfully assigned a status!");
        }
      })
     ))
  }
  trackById(index: number, status: { id: number }): number {
    return status.id;
  }

  ngOnDestroy(): void {
      this.preform.unsubscribe();
  }
}

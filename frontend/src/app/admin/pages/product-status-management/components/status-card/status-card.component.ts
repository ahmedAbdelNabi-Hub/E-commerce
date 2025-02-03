import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IStatus } from '../../../../../core/models/interfaces/IStatus';

@Component({
  selector: 'app-status-card',
  templateUrl: './status-card.component.html',
  styleUrl: './status-card.component.css'
})
export class StatusCardComponent {
  currentStatusIndex!: number;
  @Input('Status') statusData !: IStatus[]
  @Input('assignableby') assignableBy !: string
  @Output("statusId") statusIdEmitter = new EventEmitter<number>();

  selectStatus(id: number,index:number): void {
    this.currentStatusIndex = index;
    this.statusIdEmitter.emit(id); 
  }

  // TrackBy function for performance
  trackById(index: number, status: { id: number }): number {
    return status.id;
  }
}

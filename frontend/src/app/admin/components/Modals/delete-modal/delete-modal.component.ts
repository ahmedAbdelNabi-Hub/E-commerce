import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, signal, SimpleChanges } from '@angular/core';
import { StatusService } from '../../../../core/services/Status/status.service';
import { MessageService } from '../../../../core/services/Message.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css'],
  changeDetection : ChangeDetectionStrategy.OnPush  ,
})
export class DeleteModalComponent implements OnChanges, OnDestroy {
  @Input() isClosed = signal<boolean>(false);
  @Input() showMessage: boolean = false;
  @Input() isDeleteStatus: boolean = false;
  @Input() isDeleteProduct: boolean = false;
  @Input() selectedProductId: number = 0;
  @Input() selectedStatusId: number = 0;
  @Output() isSuccessful: EventEmitter<boolean> = new EventEmitter<boolean>();

  private destroy$ = new Subject<void>();

  private statusService = inject(StatusService);
  private messageService = inject(MessageService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isClosed']) {
      this.isSuccessful.emit(false);
    }
  }

  handleDelete(): void {
    if (this.isDeleteStatus) {
      this.deleteStatus(this.selectedProductId, this.selectedStatusId);
      this.isClosed.set(false);
    }
    if (this.isDeleteProduct) {
      this.deleteProduct(this.selectedProductId);
      this.isClosed.set(false);
    }
  }

  handleCancel(): void {
    this.isClosed.set(false);
  }

  private deleteStatus(productId: number, statusId: number): void {
    this.statusService.deleteStatus(productId, statusId).pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        if (response) {
          this.messageService.showSuccess("The status was deleted successfully!");
          this.isSuccessful.emit(true);
        }
      });
  }

  private deleteProduct(productId: number): void {
    // Implement the delete product logic here
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
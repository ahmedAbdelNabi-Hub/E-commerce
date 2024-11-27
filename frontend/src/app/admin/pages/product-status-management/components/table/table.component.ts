import { Component, inject, Input, OnChanges, OnDestroy, OnInit, signal, SimpleChanges } from '@angular/core';
import { Perform } from '../../../../../core/models/classes/Perform';
import { IProduct } from '../../../../../core/models/interfaces/IProduct';
import { StatusService } from '../../../../../core/services/Status/status.service';
import { IPaginationDto } from '../../../../../core/models/interfaces/IPaginationDto';
import { IProductSpecParams } from '../../../../../core/models/interfaces/IProductSpecParams';
import { fadeInOut } from '../../../../../shared/animations/fadeInOut';
import { MessageService } from '../../../../../core/services/Message.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  animations: [fadeInOut]
})
export class TableComponent implements OnInit, OnDestroy, OnChanges {
  @Input("statusId") statusId !: number;
  preform = new Perform<IPaginationDto>();
  products = signal<IPaginationDto | undefined>(undefined);
  statusService = inject(StatusService);
  productParams !: IProductSpecParams;
  messageService = inject(MessageService);
  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['statusId']) {
      this.productParams = {
        CategoryName: '',
        PageIndex: 1,
        PageSize: 10,
        StatusId: this.statusId
      }
      this.loadProductWithStatus();
    }
  }

  loadProductWithStatus(): void {
    this.preform.load(this.statusService.getProductWithStatus(this.productParams));
    this.preform.data$.subscribe(response => {
      this.products.set(response);
    })
  }
  deleteStatus(productId: number): void {
    this.statusService.deleteStatus(productId, this.statusId).subscribe(
      response => {
        if (response) {
          this.messageService.showSuccess("The Status is Delete Succsufully!");
          this.loadProductWithStatus();
        }
      }

    )
  }

  ngOnDestroy(): void {
    this.preform.unsubscribe();
  }
}

import { Component, Input, OnChanges, OnDestroy, OnInit, signal, SimpleChanges } from '@angular/core';
import { Perform } from '../../../../../core/models/classes/Perform';
import { IProduct } from '../../../../../core/models/interfaces/IProduct';
import { StatusService } from '../../../../../core/services/Status/status.service';
import { IPaginationDto } from '../../../../../core/models/interfaces/IPaginationDto';
import { IProductSpecParams } from '../../../../../core/models/interfaces/IProductSpecParams';
import { fadeInOut } from '../../../../../shared/animations/fadeInOut';
import { MessageService } from '../../../../../core/services/Message.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  animations: [fadeInOut]
})
export class TableComponent implements OnInit, OnDestroy, OnChanges {

  @Input() statusId!: number;
  perform = new Perform<IPaginationDto>();
  products = signal<IPaginationDto | undefined>(undefined);
  productId: number = 0;
  productParams!: IProductSpecParams;
  showModal = signal<boolean>(false);
  private productIndex!: number;

  private destroy$ = new Subject<void>();

  constructor(private statusService: StatusService, private messageService: MessageService) { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['statusId']) {
      this.productParams = {
        CategoryName: '',
        PageIndex: 1,
        PageSize: 10,
        StatusId: this.statusId
      };
      this.loadProductWithStatus();
    }
  }

  loadProductWithStatus(): void {
    this.perform.load(this.statusService.getProductWithStatus(this.productParams));
    this.perform.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.products.set(response);
      });
  }

  deleteStatus(productId: number, productIndex: number): void {
    this.showModal.set(true);
    this.productIndex = productIndex;
    this.productId = productId;
  }

  handelDeleteItemFromTable(event: boolean): void {
    if (event == true) {
     this.removeItemAtIndex(this.productIndex); 
    }
  }

  removeItemAtIndex(index: number): void {
    const currentProducts = this.products();
    if (currentProducts) {
      const updatedItems = [...currentProducts.data];
      if (index >= 0 && index < updatedItems.length) {
        updatedItems.splice(index, 1);
        this.products.set({
          ...currentProducts,
          data: updatedItems,
          count: updatedItems.length
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.perform.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}

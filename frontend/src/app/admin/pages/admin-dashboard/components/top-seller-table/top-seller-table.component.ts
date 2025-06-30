import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { IOrderItems } from '../../../../../core/models/interfaces/IOrderItems';
import { IProductSpecParams } from '../../../../../core/models/interfaces/IProductSpecParams';
import { ProductService } from '../../../../../core/services/Product.service';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-top-seller-table',
  templateUrl: './top-seller-table.component.html',
  styleUrl: './top-seller-table.component.css'
})
export class TopSellerTableComponent implements OnInit, OnDestroy {
  public topProdcutSales = signal<IOrderItems[]>([]);

  private productService = inject(ProductService);
  private destroy$ = new Subject<void>();
  private productSpecParams: IProductSpecParams = {
    PageIndex: 1,
    PageSize: 9,
    StatusId: 0,
    CategoryName: '',
  }

  ngOnInit(): void {
    this.getTopSeller();
  }

  getTopSeller() {
    this.productService.getTopSeller(this.productSpecParams).pipe(
      takeUntil(this.destroy$),
      tap(res => this.topProdcutSales.set(res))
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

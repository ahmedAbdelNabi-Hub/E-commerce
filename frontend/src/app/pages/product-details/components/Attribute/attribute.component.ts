import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IProductAttribute } from '../../../../core/models/interfaces/IProductAttribute';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../../../core/services/Product.service';

@Component({
  selector: 'app-attribute-details',
  templateUrl: './attribute.component.html',
  styleUrl: './attribute.component.css'
})
export class AttributeDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() productId !: number;
  productAttributes: IProductAttribute[] = [];
  error: string | null = null;
  loading = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.fetchAttributes();
  }

  fetchAttributes(): void {
    this.loading = true;
    this.productService.getProductAttributes(this.productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (attributes) => {
          this.productAttributes = attributes;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load product attributes';
          this.loading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

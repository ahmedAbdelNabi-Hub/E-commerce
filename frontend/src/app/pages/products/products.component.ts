import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { filter, distinctUntilChanged, takeUntil, delay } from 'rxjs/operators';
import { routingAnimation } from '../../shared/animations/RouteAnimation';
import { ProductService } from '../../core/services/Product.service';
import { IProductSpecParams } from '../../core/models/interfaces/IProductSpecParams';
import { IPaginationDto } from '../../core/models/interfaces/IPaginationDto';
import { IFilterationDto } from '../../core/models/interfaces/IFilteration';
import { Perform } from '../../core/services/PerformMultiple.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  animations: [routingAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush ,
})
export class ProductsComponent implements OnInit, OnDestroy {
  products = signal<IPaginationDto | null>(null);
  filters = signal<IFilterationDto[] | null>(null);
  productCategory: string | undefined;
  params: IProductSpecParams = {
    CategoryName: '',
    PageIndex: 1,
    PageSize: 10,
    StatusId: 0,
  };
  private destroy$ = new Subject<void>();
  performApi = inject(Perform<{ products: IPaginationDto, filters: IFilterationDto }>);
  isLoading$ = this.performApi.isLoading$;
  hasError$ = this.performApi.hasError$;
  errorMessage$ = this.performApi.errorMessage$;

  constructor(private _productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscribeToRouteParams();
  }

  private subscribeToRouteParams(): void {
    this.route.params
      .pipe(
        filter(params => !!params['category']),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: params => this.updateParams(params['category']),
      });
  }

  private updateParams(category: string): void {
    this.productCategory = this.sanitize(category);
    if (this.productCategory != null) {
      this.params = {
        ...this.params,
        CategoryName: this.productCategory!,
      };
    }
    this.getProductWithCategory();
  }

  private sanitize(input: string): string {
    return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Use Perform to load both products and filters in parallel
  private getProductWithCategory(): void {
    if (!this.params.CategoryName) {
      return;
    }
    const actions = {
      products: this._productService.getAllProduct(this.params).pipe(distinctUntilChanged()),
    };

    this.performApi.loadMultiple(actions);

    this.performApi.data$
      .subscribe({
        next: (results) => {
          if (results) {
            this.products.set(results.products);
            this.filters.set(results.filters);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.performApi.unsubscribe();
  }

}

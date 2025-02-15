import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, filter, Subject, takeUntil } from 'rxjs';
import { IFilterationDto } from '../../core/models/interfaces/IFilteration';
import { IPaginationDto } from '../../core/models/interfaces/IPaginationDto';
import { IProductSpecParams } from '../../core/models/interfaces/IProductSpecParams';
import { Perform } from '../../core/services/PerformMultiple.service';
import { ProductService } from '../../core/services/Product.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css'
})
export class OrderSummaryComponent {
  userDetails = [
    { label: 'Full Name', value: 'Ahmed Abd el-nabi' },
    { label: 'Email', value: 'ahmed.ahmed@yahoo.com' },
    { label: 'Phone', value: '+20 101 234 5678' },
    { label: 'Address', value: 'Helwan, Cairo, Egypt' },
    { label: 'Street', value: 'El-Nasr Street' },
    { label: 'Landmark', value: 'Near Helwan Metro Station' },

  ];
  products = signal<any[] | null>(null);
  filters = signal<IFilterationDto[] | null>(null);
  productCategory: string | undefined;
  params: IProductSpecParams = {
    CategoryName: 'laptop',
    PageIndex: 1,
    PageSize: 2,
    StatusId: 0,
  };
  private destroy$ = new Subject<void>();
  performApi = inject(Perform<{ products: IPaginationDto, filters: IFilterationDto }>);
  isLoading$ = this.performApi.isLoading$;
  hasError$ = this.performApi.hasError$;
  errorMessage$ = this.performApi.errorMessage$;

  constructor(private _productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this._productService.getAllProduct(this.params).pipe(distinctUntilChanged()).subscribe(
      res => {
        this.products.set(res.data);
        console.log(this.products())
      }
    )

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
      filters: this._productService.getAllFilterWithCategoy(this.params?.CategoryName).pipe(distinctUntilChanged())
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

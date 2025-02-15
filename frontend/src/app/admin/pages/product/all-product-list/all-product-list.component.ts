import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { catchError, EMPTY, tap } from 'rxjs';
import { Perform } from '../../../../core/models/classes/Perform';
import { ICategory } from '../../../../core/models/interfaces/ICategory';
import { IPaginationDto } from '../../../../core/models/interfaces/IPaginationDto';
import { IProductSpecParams } from '../../../../core/models/interfaces/IProductSpecParams';
import { CategoryService } from '../../../../core/services/Category/Category.service';
import { ProductService } from '../../../../core/services/Product.service';
import { ErrorHandlerService } from '../../../../core/services/ErrorHandler.service';
import { MessageService } from '../../../../core/services/Message.service';
import { StatusService } from '../../../../core/services/Status/status.service';
import { IProduct } from '../../../../core/models/interfaces/IProduct';
import { Router } from '@angular/router';
import { AnimationOpcity } from '../../../../shared/animations/RouteAnimation';
import { fadeInOut } from '../../../../shared/animations/fadeInOut';

@Component({
  selector: 'app-all-product-list',
  templateUrl: './all-product-list.component.html',
  styleUrls: ['./all-product-list.component.css'],
  animations: [fadeInOut],
})
export class AllProductListComponent implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private errorHandler = inject(ErrorHandlerService);  
  private messageHandelr = inject(MessageService)
  private statuseService = inject(StatusService);
  private router = inject(Router);
  productParams: IProductSpecParams = {
    CategoryName: '',
    StatusId: 0,
    PageIndex: 1,
    PageSize: 8,
  };

  perform = new Perform<IPaginationDto>();
  productsWithPagination = signal<IPaginationDto | null>(null); 
  categories = signal<ICategory[]>([]);  

  categoryName = '';
  isDropdownVisible = false;
  DropdownIndex = 0;

  totalItems = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 10;
  pages: number[] = [];

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  toggleDropdown(index: number): void {
    this.DropdownIndex = index;
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  loadProducts(): void {
    this.perform.load(this.productService.getAllProduct(this.productParams));
    this.perform.data$.subscribe({
      next: (response) => {
        if (response) {
          this.updatePagination(response);
          this.productsWithPagination.set(response);  // Update signal data
        }
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().pipe(
      tap((categories) => this.categories.set(categories)),  // Set categories signal
      catchError((err) => {
        this.errorHandler.handleError(err);  // Handle error
        return EMPTY;
      })
    ).subscribe();
  }

  updatePagination(data: IPaginationDto): void {
    this.pageSize = data.pageSize;
    this.currentPage = data.pageIndex;
    this.totalPages = Math.ceil(data.count / data.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changeCategory(categoryName: string): void {
    this.productParams.CategoryName = categoryName;
    this.loadProducts();  // Reload products based on the selected category
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.productParams.PageIndex = page;
      this.loadProducts();  // Reload products for the selected page
    }
  }

  delete(productId: number): void {
    this.perform.load(this.productService.deleteProduct(productId).pipe(
      tap(response => {
        if (response) {
          this.messageHandelr.showSuccess("Product deleted successfully");
        }
      })
    ));
    this.loadProducts();
  }
  goInAddProductFormWithData(data:IProduct):void{
    this.router.navigate(['/admin/product'], { queryParams: { update: 'true', sku: data.id } });
  }
  ShowstatusPopup(productId: number): void {
    this.statuseService.showStatusPopup(productId);
  }
  ngOnDestroy(): void {
    this.perform.unsubscribe();
  }
}

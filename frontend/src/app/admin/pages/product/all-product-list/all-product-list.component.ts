import {
  Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject, signal, computed,
  ViewChild, ElementRef, HostListener,
  AfterViewInit
} from '@angular/core';
import { catchError, debounceTime, EMPTY, tap, Subject, takeUntil } from 'rxjs';
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

@Component({
  selector: 'app-all-product-list',
  templateUrl: './all-product-list.component.html',
  styleUrls: ['./all-product-list.component.css'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllProductListComponent implements OnInit, OnDestroy, AfterViewInit {

  // Inject Services
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private errorHandler = inject(ErrorHandlerService);
  private messageHandler = inject(MessageService);
  private statusService = inject(StatusService);
  private router = inject(Router);

  @ViewChild('productContainer', { static: false }) productContainer!: ElementRef;

  // Product Parameters
  productParams: IProductSpecParams = { CategoryName: '', StatusId: 0, PageIndex: 1, PageSize: 20 };
  perform = new Perform<IPaginationDto>();

  //  Use Signals for State Management
  productsWithPagination = signal<IPaginationDto | null>(null);
  products = computed(() => this.productsWithPagination()?.data ?? []);
  categories = signal<ICategory[]>([]);
  categoryChange$ = new Subject<string>();

  activeDropdown: string | null = null;
  isDropdownVisible = false;
  DropdownIndex = 0;
  categoryName: string = ''
  private destroy$ = new Subject<void>();


  // Pagination State
  totalItems = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 10;
  productId !: number;
  pages: number[] = [];
  activeModal: boolean = false;

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();

    this.categoryChange$.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe((categoryName: string) => {
      this.productParams.CategoryName = categoryName;
      this.loadProducts();
    });

  }

  ngAfterViewInit(): void {
  }


  loadProducts(): void {
    this.perform.load(this.productService.getAllProduct(this.productParams));
    this.perform.data$.subscribe({
      next: (response) => {
        if (response) {
          this.updatePagination(response);
          this.productsWithPagination.set(response);
        }
      },
    });
  }

  activeProduct(id: number) {
    this.productId = id;
    console.log(id);
    this.activeModal = true;  // Show confirmation modal
  }

  postActiveProduct(): void {
    if (!this.productId) return;

    this.productService.activateProduct(this.productId).subscribe({
      next: (response) => {
        this.messageHandler.showSuccess("Product activated successfully!");
        this.loadProducts();
        this.activeModal = false;
      },
      error: (error) => {
        this.errorHandler.handleError(error);
      }
    });
  }


  loadCategories(): void {
    this.categoryService.getAllCategories().pipe(
      tap((categories) => this.categories.set(categories)),
      catchError((err) => {
        this.errorHandler.handleError(err);
        return EMPTY;
      })
    ).subscribe();
  }

  delete(productId: number): void {
    this.productsWithPagination.update(data => ({
      ...data!,
      data: data!.data.filter(product => product.id !== productId),
    }));
    this.messageHandler.showSuccess("Product deleted successfully");
  }

  updatePagination(data: IPaginationDto): void {
    this.pageSize = data.pageSize;
    this.currentPage = data.pageIndex;
    this.totalPages = Math.ceil(data.count / data.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.productParams.PageIndex = page;
      this.loadProducts();
    }
  }

  changeCategory(categoryName: string): void {
    this.categoryChange$.next(categoryName);
  }

  goInAddProductFormWithData(data: IProduct): void {
    this.router.navigate(['/admin/product'], { queryParams: { update: 'true', sku: data.id } });
  }

  ShowstatusPopup(productId: number): void {
    this.statusService.showStatusPopup(productId);
  }

  isGiftPopupVisible = false;

  showGiftPopup(): void {
    this.isGiftPopupVisible = true;
  }

  closeGiftPopup(): void {
    this.isGiftPopupVisible = false;
  }

  onGiftProductsSelected(products: any[]): void {
    console.log('Selected gift products:', products);
    // TODO: Implement gift product assignment logic
  }

  toggleDropdown(index: number): void {
    this.DropdownIndex = index;
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  setActiveDropdown(dropdownId: string): void {
    this.activeDropdown = this.activeDropdown === dropdownId ? null : dropdownId;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.productContainer || !this.productContainer.nativeElement) return; // Add this check

    if (!this.productContainer.nativeElement.contains(event.target)) {
      this.activeDropdown = null;
    }
  }

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();
    this.perform.unsubscribe();
  }
}

import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/Product.service';
import { IProduct } from '../../core/models/interfaces/IProduct';
import { tap } from 'rxjs/operators';
import { IProductSpecParams } from '../../core/models/interfaces/IProductSpecParams';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'], // corrected styleUrls
})
export class ProductDetailsComponent implements AfterViewInit, OnInit {
  @ViewChild('detailsSection', { static: true }) detailsSection!: ElementRef;
  @ViewChild('overviewSection', { static: true }) overviewSection!: ElementRef;
  private detailsSectionOffset: number = 0;
  private overviewSectionOffset: number = 0;
  private route = inject(ActivatedRoute);
  _productService = inject(ProductService);
  detailsProduct!: IProduct | null; 
  activeSection: string = 'overview';
  productId?: number;
  params !: IProductSpecParams;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.productId = params['sku'];
      if (this.productId) {
        this.getDetailsOfProduct(this.productId);
      }
    });
  }

  getDetailsOfProduct(id: number): void {
    this._productService.getProductWithIdAndStoreInRedis(id, true).pipe(
      tap(response => {
        this.detailsProduct = response;
        console.log(this.detailsProduct);
        this.setParams();
      })
    ).subscribe();
  }
  setParams(): void {
    if (this.detailsProduct?.categoryName != null) {
      this.params = {
        CategoryName: this.detailsProduct?.categoryName,
        StatusId: 0,
        PageIndex: 1,
        PageSize: 6,
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.detailsSectionOffset = this.detailsSection.nativeElement.offsetTop;
      this.overviewSectionOffset = this.overviewSection.nativeElement.offsetTop;
    }, 0);
  }

  onScroll(scrollPosition: number) {
    if (scrollPosition >= this.detailsSectionOffset && scrollPosition > this.overviewSectionOffset) {
      this.activeSection = 'details';
    } else if (scrollPosition >= this.overviewSectionOffset) {
      this.activeSection = 'overview';
    }
  }
}

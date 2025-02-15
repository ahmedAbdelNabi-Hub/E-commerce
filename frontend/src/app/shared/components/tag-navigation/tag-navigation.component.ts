import { Component, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { Perform } from '../../../core/models/classes/Perform';
import { IProduct } from '../../../core/models/interfaces/IProduct';
import { ProductService } from '../../../core/services/Product.service';
import { IProductSpecParams } from '../../../core/models/interfaces/IProductSpecParams';
import { IPaginationDto } from '../../../core/models/interfaces/IPaginationDto';
import { map, catchError } from 'rxjs';
import { groupProductByName } from '../../../core/utils/groupProductByName';
import { of } from 'rxjs';
import { contentAnimation, imageAnimation } from '../../animations/contentAnimation';

@Component({
  selector: 'app-tag-navigation',
  templateUrl: './tag-navigation.component.html',
  styleUrl: './tag-navigation.component.css',
  animations: [contentAnimation, imageAnimation]
})
export class TagNavigationComponent implements OnInit, OnDestroy {

  @Input("TitleTagNevigation") Title !: string;
  handelService = new Perform<IPaginationDto>();
  showAnimation = true;
  groupProductByNameData = signal<{ key: string; value: IProduct[] }[]>([]);  // Array of objects with key-value structure
  productService = inject(ProductService);
  productParams = signal<IProductSpecParams | null>(null);
  containtTag = signal<IProduct[] | []>([]);
  activeIndex: number = 0;
  constructor() {
    this.productParams.set({
      CategoryName: 'washingmachines',
      PageIndex: 1,
      PageSize: 4,
      StatusId: 0
    });
  }

  loadProduct(): void {
    this.handelService.load(this.productService.getAllProduct(this.productParams()!));
    this.handelService.data$.pipe(
      map(response => {
        if (response) {
          const groupedData = groupProductByName(response.data);
          const groupedArray = Object.entries(groupedData).map(([key, value]) => ({
            key,
            value
          }));
          this.groupProductByNameData.set(groupedArray);
          console.log(this.groupProductByNameData())
          if (groupedArray.length > 0) {
            this.containtTag.set(groupedArray[0].value);
          }
        }
      }),

    ).subscribe();
  }

  getNextTag(tagIndex: number): void {
    if (this.activeIndex != tagIndex) {
      this.activeIndex = tagIndex;
      this.showAnimation = false; // Remove current content
      setTimeout(() => {
        const items = this.groupProductByNameData();
        if (tagIndex >= 0 && tagIndex < items.length) {
          this.containtTag.set(items[tagIndex].value); // Update content
        } else {
          this.containtTag.set([]);
        }
        this.showAnimation = true; // Re-add content to trigger animation
      }, 570); // Match or exceed the animation duration
    }
  }


  ngOnInit(): void {
    this.loadProduct();
  }

  ngOnDestroy(): void {
    this.handelService.unsubscribe();
  }
}

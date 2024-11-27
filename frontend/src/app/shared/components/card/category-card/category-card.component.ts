import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CategoryService } from '../../../../core/services/Category/Category.service';
import { ICategory } from '../../../../core/models/interfaces/ICategory';
import { map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.css'
})
export class CategoryCardComponent implements OnInit , OnDestroy{

  @ViewChild('link_container') linksContainer!: ElementRef;
  categories!: ICategory[] 
  private destroy$ = new Subject<void>();
  isleft: boolean = false;
  currentRoute!: string;
  scrollLefts = 0;
  constructor(private _CategoryService: CategoryService) { }
  ngOnInit(): void {
    this._CategoryService.getAllCategories().pipe(
      map(response=>{
        if(response!=null){
          this.categories=response;
        }
      }),takeUntil(this.destroy$)
    ).subscribe();
  }
 ngOnDestroy(): void {
     this.destroy$.next();
     this.destroy$.complete();
 }
  scrollLeft(): void {
    this.linksContainer.nativeElement.scrollBy({
      left: -300,
      behavior: 'smooth'
    });
    this.scrollLefts = this.linksContainer.nativeElement.scrollLeft;
    if (this.scrollLefts <= 300 || this.scrollLefts == 0) {
      this.isleft = false;
    }
  }

  scrollRight(): void {
    this.linksContainer.nativeElement.scrollBy({
      left: 300,
      behavior: 'smooth'
    });
    this.isleft = true;
    this.scrollLefts = this.linksContainer.nativeElement.scrollLeft;
  }
}

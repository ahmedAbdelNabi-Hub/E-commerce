import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-carousel',
  templateUrl: './custom-carousel.component.html',
  styleUrl: './custom-carousel.component.css'
})
export class CustomCarouselComponent {
  @Input() data!:any[]; 
  @Input() name!:string;
  @Input() types!:string;
  globalScroll:number=300;
  backscroll:number=300;
  closeTrending:any;
  closeTopRating:any; 
  
  
  
  track(index:number):number|string{
    return index
    }

    next(cont:HTMLDivElement):void{
    this.backscroll=this.backscroll-250;
    this.globalScroll=(cont.scrollWidth/ this.globalScroll)+ this.globalScroll+250;
    cont.scrollTo( this.globalScroll,0);
    }
    
    back(cont:HTMLDivElement):void{
      this.globalScroll=this.globalScroll-250;
      this.backscroll=(cont.scrollWidth/ this.backscroll)+ this.backscroll+250;
      cont.scrollTo(-this.backscroll,0);
    }
  
}

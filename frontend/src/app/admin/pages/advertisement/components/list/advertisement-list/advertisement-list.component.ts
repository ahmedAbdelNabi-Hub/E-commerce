import { Component, inject, OnInit, signal } from '@angular/core';
import { tap, catchError, of } from 'rxjs';
import { ImageSliderService } from '../../../../../../core/services/imageSlider.service';

@Component({
  selector: 'app-advertisement-list',
  templateUrl: './advertisement-list.component.html',
  styleUrl: './advertisement-list.component.css'
})
export class AdvertisementListComponent implements OnInit {
  private imageSliderService = inject(ImageSliderService)
   imageSlider = signal<any[]>([]);
  
  ngOnInit(): void {

    this.imageSliderService.getImageSlider().pipe(
      tap(response => {
        this.imageSlider.set(response);
        console.log(this.imageSlider())
      }),
      catchError(error => {
        console.error('Error fetching image slider:', error);
        return of([]); // Return an empty array on error
      }),
    ).subscribe();
  }
}

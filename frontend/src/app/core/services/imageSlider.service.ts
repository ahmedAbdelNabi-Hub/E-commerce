import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { ImageSlider } from '../models/interfaces/ImageSlider';
import { API_URLS } from '../constant/api-urls';

@Injectable({
  providedIn: 'root'
})
export class ImageSliderService {
  private cache$: Observable<ImageSlider[]> | null = null;
  constructor(private http: HttpClient) {}
 
  getImageSlider(): Observable<ImageSlider[]> {
    if (!this.cache$) {
      this.cache$ = this.http.get<ImageSlider[]>(`https://localhost:7197${API_URLS.advertisement}`).pipe(
        shareReplay(1), 
        catchError(this.handleError<ImageSlider[]>('getImageSlider', [])) // Handle error
      );
    }
    return this.cache$;
  }

  // Generic error handler
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T); // Return default value to avoid breaking the app
    };
  }

  // Clear the cache in case of updates
  clearCache() {
    this.cache$ = null;
  }
}

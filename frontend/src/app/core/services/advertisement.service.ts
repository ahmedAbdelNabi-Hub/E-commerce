import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { Iadvertisement } from '../models/interfaces/ImageSlider';
import { API_URLS } from '../constant/api-urls';
import { IBaseApiResponse } from '../models/interfaces/IBaseApiResponse';

@Injectable({
    providedIn: 'root'
})
export class AdvertisementService {
    private advertisementCache$: Observable<Iadvertisement[]> | null = null;
    private activeAdvertisementCache$: Observable<Iadvertisement[]> | null = null;

    constructor(private http: HttpClient) { }

    /**
     * Get all advertisements (active or inactive)
     */
    getAdvertisements(): Observable<Iadvertisement[]> {
        if (!this.advertisementCache$) {
            this.advertisementCache$ = this.http.get<Iadvertisement[]>(`https://localhost:7197${API_URLS.advertisement}`)
                .pipe(
                    shareReplay(1),
                    catchError(error => {
                        this.advertisementCache$ = null;
                        return of([]);
                    })
                );
        }
        return this.advertisementCache$;
    }

    /**
     * Get active advertisements only
     */
    getActiveAdvertisements(): Observable<Iadvertisement[]> {
        if (!this.activeAdvertisementCache$) {
            this.activeAdvertisementCache$ = this.http.get<Iadvertisement[]>(`https://localhost:7197${API_URLS.advertisement}?isActive=true`)
                .pipe(
                    shareReplay(1),
                    catchError(error => {
                        this.activeAdvertisementCache$ = null;
                        return of([]);
                    })
                );
        }
        return this.activeAdvertisementCache$;
    }

    /**
     * Create a new advertisement
     */
    createAd(data: FormData): Observable<IBaseApiResponse> {
        return this.http.post<IBaseApiResponse>('https://localhost:7197/api/Advertisement/create', data)
            .pipe(
                tap(() => this.clearCache()) // Clear cache upon creating a new ad
            );
    }

    toggleStatusAdvertisement(id: number): Observable<IBaseApiResponse> {
        return this.http.patch<IBaseApiResponse>(`https://localhost:7197${API_URLS.advertisement}/toggle-status/${id}`, {})
    }

    /**
     * Clear all caches (active and all advertisements)
     */
    clearCache() {
        this.advertisementCache$ = null;
        this.activeAdvertisementCache$ = null;
    }
}

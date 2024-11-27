import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Navbar } from '../models/interfaces/navbar.model';
import { API_URLS } from '../constant/api-urls';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  constructor(private http: HttpClient) { }

  getNavbars(): Observable<Navbar[]> {
    return this.http.get<Navbar[]>(`https://localhost:7197${API_URLS.navbar}`).pipe(
      catchError(error => {
        // Handle error appropriately
        console.error('Error fetching navbars', error);
        return of([]); // Return an empty array or handle the error as needed
      })
    );
  }
}
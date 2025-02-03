import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private apiKey: string = 'AIzaSyCX6DxjsS0PklcQuXaX_arDp071_CPcP6E'; // Your actual API key
  private apiUrl: string = 'https://translation.googleapis.com/language/translate/v2';

  constructor(private http: HttpClient) {}

  translateText(text: string, targetLanguage: string): Observable<any> {
    const body = {
      q: text,
      target: targetLanguage,
      format: 'text',
      key: this.apiKey,
    };

    return this.http.post<any>(this.apiUrl, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
}

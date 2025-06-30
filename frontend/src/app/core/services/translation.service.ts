// google-translate.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GoogleTranslateService {
  private url = 'https://translate.googleapis.com/translate_a/single';

  constructor(private http: HttpClient) {}

  translate(text: string, targetLang: string = 'ar', sourceLang: string = 'en'): Observable<string> {
    const params = new HttpParams()
      .set('client', 'gtx')
      .set('sl', sourceLang)
      .set('tl', targetLang)
      .set('dt', 't')
      .set('q', text);

    return new Observable(observer => {
      this.http.get<any>(this.url, { params }).subscribe({
        next: res => {
          const translated = res[0].map((x: any) => x[0]).join('');
          observer.next(translated);
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }
}

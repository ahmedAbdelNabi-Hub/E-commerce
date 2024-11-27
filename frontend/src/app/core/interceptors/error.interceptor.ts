import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../services/ErrorHandler.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private errorHandlerService: ErrorHandlerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorHandlerService.handleError(error);
        return throwError(() => error);
      })
    );
  }
}

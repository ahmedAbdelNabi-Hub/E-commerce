import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { IBaseApiResponse } from '../models/interfaces/IBaseApiResponse';

@Injectable({
    providedIn: 'root',
})
export class ErrorHandlerService {
    private errorMessageSubject = new BehaviorSubject<string>('');
    private statusCodeSubject = new BehaviorSubject<number | null>(null);
    errorMessage$ = this.errorMessageSubject.asObservable();
    statusCode$ = this.statusCodeSubject.asObservable();

    handleError(error: HttpErrorResponse): void {
        let errorMessage = '';
        let statusCode = error.status;

        if (error.error instanceof ErrorEvent) {
            errorMessage = `Client-side error: ${error.error.message}`;
        } else {
            const apiResponse: IBaseApiResponse = error.error;
            errorMessage = apiResponse.message || 'An unknown error occurred';

            switch (statusCode) {
                case 400:
                    errorMessage = `Bad Request: ${errorMessage}`;
                    break;
                case 401:
                    errorMessage = 'Unauthorized. Please login again.';
                    break;
                case 403:
                    errorMessage = 'Access denied.';
                    break;
                case 404:
                    errorMessage = `${errorMessage}`;
                    break;
                case 500:
                    errorMessage = 'Internal server error. Please try again later.';
                    break;
                default:
                    errorMessage = `Unexpected error: ${errorMessage}`;
            }
        }
        this.errorMessageSubject.next(errorMessage); // Set the error message
        this.statusCodeSubject.next(statusCode); // Set the status code
    }

    clearError(): void {
        this.errorMessageSubject.next('');
        this.statusCodeSubject.next(null);
    }
}
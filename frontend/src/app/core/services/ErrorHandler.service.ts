import { Injectable, WritableSignal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ErrorHandlerService {
    private errorMessageSubject = new BehaviorSubject<string>('');
    errorMessage$ = this.errorMessageSubject.asObservable();

    handleError(error: HttpErrorResponse): void {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Client-side error: ${error.error.message}`;
        } else {
            switch (error.status) {
                case 400:
                    errorMessage = ` ${error.error.massage || 'Bad Request'}`;
                    break;
                case 401:
                    errorMessage = 'Unauthorized. Please login again.';
                    break;
                case 403:
                    errorMessage = 'Access denied.';
                    break;
                case 404:
                    errorMessage = ` ${error.error.massage || 'Bad Request'}`;                    break;
                case 500:
                    errorMessage = 'Internal server error. Please try again later.';
                    break;
                default:
                    errorMessage = `${error.error.massage || 'Bad Request'}`;
                }
        }
        this.errorMessageSubject.next(errorMessage);
    }

    handleComponentError(
        error: HttpErrorResponse,
        errorMessageSignal: WritableSignal<string>,
        hasErrorSignal: WritableSignal<boolean>,
        isLoadingSignal: WritableSignal<boolean>
    ): void {
        this.handleError(error); // Delegate to core error handling logic
        this.errorMessage$.subscribe((message) => {
            errorMessageSignal.set(message);
            hasErrorSignal.set(true);
            isLoadingSignal.set(false);
        });
    }

    clearError(): void {
        this.errorMessageSubject.next('');
    }
}


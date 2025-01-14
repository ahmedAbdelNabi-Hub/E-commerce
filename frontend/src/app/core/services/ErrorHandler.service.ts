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

        // Ensure error.error is an object before accessing its properties
        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Client-side error: ${error.error.message}`;
        } else {
            // Server-side error
            if (error.error && error.error.message) {
                // If error.error and error.error.message exist
                errorMessage = ` ${error.error.message || 'An unknown error occurred'}`;
            } else {
                // Default message if error.error or error.error.message is undefined
                errorMessage = `An unknown error occurred. Status: ${error.status}`;
            }

            switch (error.status) {
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
                    errorMessage = `Not Found: ${errorMessage}`;
                    break;
                case 500:
                    errorMessage = 'Internal server error. Please try again later.';
                    break;
                default:
                    errorMessage = `Unexpected error: ${errorMessage}`;
            }
        }

        console.error('Error handled:', errorMessage); // For debugging
        this.errorMessageSubject.next(errorMessage); // Set the error message
    }

    handleComponentError(
        error: HttpErrorResponse,
        errorMessageSignal: WritableSignal<string>,
        hasErrorSignal: WritableSignal<boolean>,
        isLoadingSignal: WritableSignal<boolean>
    ): void {
        this.handleError(error); // Call core error handler
        const message = this.errorMessageSubject.getValue(); // Get the current error message
        errorMessageSignal.set(message); // Set the error message in the component's signal
        hasErrorSignal.set(true); // Indicate that there's an error
        isLoadingSignal.set(false); // Set loading state to false
    }

    clearError(): void {
        this.errorMessageSubject.next('');
    }
}

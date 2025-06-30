import { inject, Injectable } from '@angular/core';
import {
    BehaviorSubject,
    catchError,
    EMPTY,
    Observable,
    Subject,
    finalize,
    takeUntil,
    forkJoin,
    delay,
} from 'rxjs';
import { ErrorHandlerService } from './ErrorHandler.service';
import { MessageService } from './Message.service';

@Injectable({
    providedIn: 'root',
})
export class Perform<T> {
    private dataSubject = new BehaviorSubject<T | any>(null);
    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<boolean>(false);
    private destroy$ = new Subject<void>();
    private errorMessage = new BehaviorSubject<string>('');
    private errorHandler = inject(ErrorHandlerService);

    data$ = this.dataSubject.asObservable();
    isLoading$ = this.isLoadingSubject.asObservable();
    hasError$ = this.errorSubject.asObservable();
    errorMessage$ = this.errorMessage.asObservable();

    private stateSubject = new BehaviorSubject({
        isLoading: false,
        hasError: false,
        errorMessage: '',
    });
    state$ = this.stateSubject.asObservable();

    load(action$: Observable<T>): void {
        this.resetState();
        this.isLoadingSubject.next(true);
        action$
            .pipe(
                takeUntil(this.destroy$),
                catchError((error) => this.handleError(error)),
                finalize(() => this.isLoadingSubject.next(false))
            )
            .subscribe((data) => {
                this.dataSubject.next(data);
            });
    }

    loadMultiple(actions$: { [key: string]: Observable<any> }): void {
        this.resetState();
        this.isLoadingSubject.next(true);

        // Convert actions$ object into an array of observables
        const actionKeys = Object.keys(actions$);
        const actionObservables = actionKeys.map((key) => actions$[key]);

        forkJoin(actionObservables)
            .pipe(
                takeUntil(this.destroy$),
                catchError((error) => this.handleError(error)), // Make sure to handle errors properly
                finalize(() => this.isLoadingSubject.next(false)) // Ensure loading is completed after the API call
            )
            .subscribe({
                next: (results: any[]) => {
                    const resultObject: { [key: string]: any } = {};
                    actionKeys.forEach((key, index) => {
                        resultObject[key] = results[index]; // Assign each result to its corresponding key
                    });
                    this.dataSubject.next(resultObject); // Emit the resultObject as the data
                },
                error: (error) => {
                    console.error('Error in forkJoin:', error);
                },
            });
    }
    private resetState(): void {
        this.dataSubject.next(undefined);
        this.errorSubject.next(false);
        this.errorMessage.next('');
        this.stateSubject.next({
            isLoading: false,
            hasError: false,
            errorMessage: '',
        });
    }

    private handleError(error: any): Observable<never> {
        this.errorHandler.handleError(error);
        this.errorHandler.errorMessage$.subscribe({
            next: (message) => {
                this.errorMessage.next(message);
            },
        });

        this.errorSubject.next(true);
        this.dataSubject.next(undefined);
        return EMPTY;
    }

    unsubscribe(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.dataSubject.complete();
        this.stateSubject.complete();
    }
}

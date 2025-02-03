import { Injectable, inject } from '@angular/core';
import {
    BehaviorSubject,
    catchError,
    EMPTY,
    Observable,
    Subject,
    finalize,
    takeUntil,
    switchMap,
} from 'rxjs';
import { ErrorHandlerService } from './ErrorHandler.service';
import { MessageService } from './Message.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class PerformService<T> {
    private dataSubject = new BehaviorSubject<T | undefined>(undefined);
    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<boolean>(false);
    private destroy$ = new Subject<void>();
    private errorMessageSubject = new BehaviorSubject<string>('');
    private statusCodeSubject = new BehaviorSubject<number | null>(null);

    private errorHandler = inject(ErrorHandlerService);
    private messageService = inject(MessageService);

    data$ = this.dataSubject.asObservable();
    isLoading$ = this.isLoadingSubject.asObservable();
    hasError$ = this.errorSubject.asObservable();
    errorMessage$ = this.errorMessageSubject.asObservable();
    statusCode$ = this.statusCodeSubject.asObservable();

    load(action$: Observable<T>): void {
        this.isLoadingSubject.next(true);
        this.errorSubject.next(false);

        action$
            .pipe(
                takeUntil(this.destroy$),
                switchMap((result: T) => {
                    this.dataSubject.next(result);
                    return EMPTY;
                }),
                catchError((error: HttpErrorResponse) => {
                    this.errorHandler.handleError(error);
                    this.statusCodeSubject.next(error.status);
                    return this.errorHandler.errorMessage$.pipe(
                        takeUntil(this.destroy$),
                        switchMap((response) => {
                            this.errorMessageSubject.next(response);
                            this.dataSubject.next(undefined);
                            this.errorSubject.next(true);
                            return EMPTY;
                        })
                    );
                }),
                finalize(() => {
                    this.isLoadingSubject.next(false);
                })
            )
            .subscribe();
    }

    unsubscribe(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
import { inject } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';
import { catchError, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { ErrorHandlerService } from '../../services/ErrorHandler.service';
import { MessageService } from '../../services/Message.service';
import { HttpErrorResponse } from '@angular/common/http';

export class Perform<T> {
  private dataSubject = new BehaviorSubject<T | undefined>(undefined);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<void>();
  private errorMessage = new BehaviorSubject<string>('');
  private statusCode = new BehaviorSubject<number | null>(null);

  private errorHandler = inject(ErrorHandlerService);
  private messageService = inject(MessageService);

  data$ = this.dataSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();
  hasError$ = this.errorSubject.asObservable();
  errorMessage$ = this.errorMessage.asObservable();
  statusCode$ = this.statusCode.asObservable();

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
          this.statusCode.next(error.status);
          return this.errorHandler.errorMessage$.pipe(
            takeUntil(this.destroy$),
            switchMap((response) => {
              this.errorMessage.next(response);
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
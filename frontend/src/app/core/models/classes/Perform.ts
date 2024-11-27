import { inject } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, Observable, Subject, finalize, takeUntil, delay } from 'rxjs';
import { ErrorHandlerService } from '../../services/ErrorHandler.service';
import { MessageService } from '../../services/Message.service';

export class Perform<T> {
  private dataSubject = new BehaviorSubject<T | undefined>(undefined);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<void>();
  private errorMassage = new BehaviorSubject<string>('');
  private errorHandler = inject(ErrorHandlerService);
  private messageService = inject(MessageService);
  data$ = this.dataSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();
  hasError$ = this.errorSubject.asObservable();
  errorMassage$ = this.errorMassage.asObservable();

  load(action$: Observable<T>): void {
    this.isLoadingSubject.next(true);
    this.errorSubject.next(false);

    action$
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          this.errorHandler.handleError(error);
          this.errorHandler.errorMessage$.subscribe({
            next: (response) => {
              this.errorMassage.next(response)
              this.messageService.showError(response);
            }
          })

          this.dataSubject.next(undefined);
          this.errorSubject.next(true);
          return EMPTY;
        }),
        finalize(() => {
          this.isLoadingSubject.next(false);
        })
      )
      .subscribe((data: T) => {
        this.dataSubject.next(data);
      });
  }

  unsubscribe(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

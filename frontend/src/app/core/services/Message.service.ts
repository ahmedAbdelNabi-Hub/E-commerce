import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageSubject = new Subject<{ message: string, type: 'success' | 'error' }>();

  // Observable for components to subscribe to
  message$ = this.messageSubject.asObservable();

  // Method to show success message
  showSuccess(message: string): void {
    this.messageSubject.next({ message, type: 'success' });
  }

  // Method to show error message
  showError(message: string): void {
    this.messageSubject.next({ message, type: 'error' });
  }
}

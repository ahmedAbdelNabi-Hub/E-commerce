import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageSubject = new Subject<{ message: string, type: 'success' | 'error' } >();

  message$ = this.messageSubject.asObservable();

  showSuccess(message: string): void {
    this.messageSubject.next({ message, type: 'success' });
  }

  clear():void{
    this.messageSubject.next({message:'',type:'success'})

  }
  // Method to show error message
  showError(message: string): void {
    this.messageSubject.next({ message, type: 'error' });
  }
}

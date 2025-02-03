import { Component, OnDestroy, OnInit, Renderer2, ElementRef, signal, ChangeDetectionStrategy } from '@angular/core';
import { MessageService } from '../../../core/services/Message.service';
import { transformAnimation } from '../../animations/transformAnimation';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-message-handler',
  templateUrl: './message-handler.component.html',
  styleUrls: ['./message-handler.component.css'],
  animations: [transformAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageHandlerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Reactive signal for message queue
  messageQueue = signal<{ message: string; type: string }[]>([]);

  hidden: boolean = false;

  constructor(
    private messageService: MessageService,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.messageService.message$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ message, type }) => {
        const currentQueue = this.messageQueue();
        this.messageQueue.set([...currentQueue, { message, type }]);
        if (currentQueue.length === 0) {
          this.hidden = true;
          this.showNextMessage();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private showNextMessage(): void {
    if (this.messageQueue().length === 0) {
      this.hidden = false;
      return;
    }

    setTimeout(() => {
      const updatedQueue = [...this.messageQueue()];
      updatedQueue.shift(); // Remove the displayed message
      this.messageQueue.set(updatedQueue); // Update the reactive queue
      this.showNextMessage(); // Show the next message if available
    }, 3000);
  }
}

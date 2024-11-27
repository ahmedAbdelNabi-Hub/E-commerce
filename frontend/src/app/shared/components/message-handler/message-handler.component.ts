import { Component, OnInit } from '@angular/core';

import { MessageService } from '../../../core/services/Message.service';
import { transformAnimation } from '../../animations/transformAnimation';


@Component({
  selector: 'app-message-handler',
  templateUrl: './message-handler.component.html',
  styleUrls: ['./message-handler.component.css'],
  animations: [transformAnimation]
})
export class MessageHandlerComponent implements OnInit {
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    // Subscribe to the message observable from the service
    this.messageService.message$.subscribe(({ message, type }) => {
      this.message = message;
      this.messageType = type;

      setTimeout(() => {
        this.message = '';  // Clear the message after 5 seconds
      }, 3000);
    });
  }
}

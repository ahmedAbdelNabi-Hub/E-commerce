import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { modalAnimations } from '../../animations/modalAnimations';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  animations: [modalAnimations.fadeInOut, modalAnimations.slideUpDown],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();


  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  close() {
    this.closeModal.emit();
  }
}

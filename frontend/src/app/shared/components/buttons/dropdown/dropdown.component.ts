import { Component, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  animations: [
    trigger('dropdownAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class DropdownComponent {
  @Input() dropdownId!: string;  // Unique ID for each dropdown
  @Input() activeDropdown!: string | null; // Controls which dropdown is open
  @Output() toggle = new EventEmitter<string>(); // Emits event to parent

  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;

  constructor(private elementRef: ElementRef) {}

  get isOpen() {
    return this.activeDropdown === this.dropdownId;
  }

  toggleDropdown(event: Event) {
    event.stopPropagation(); // Prevent event bubbling
    this.toggle.emit(this.isOpen ? '' : this.dropdownId);
  }

  /** ✅ Close dropdown when clicking outside */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.toggle.emit('');
    }
  }
}

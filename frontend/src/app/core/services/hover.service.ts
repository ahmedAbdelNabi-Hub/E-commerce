import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // Make sure the service is provided at the root level
})
export class HoverService {
  private hoverSubject = new BehaviorSubject<boolean>(false);
  hoverState$ = this.hoverSubject.asObservable();

  setHoverState(isHovered: boolean): void {
    this.hoverSubject.next(isHovered);
  }
}

import { Directive, ElementRef, inject, output } from '@angular/core';
import { DragService } from '../services/drag.service';

@Directive({
  selector: '[appDrop]',
  host: {
    '(document:pointerup)': 'onPointerUp($event)'
  }
})
export class Drop {
  appDrop = output<void>();

  private service = inject(DragService);
  private el = inject(ElementRef);

  onPointerUp(event: PointerEvent) {
    const dragging = this.service.dragging();
    if (!dragging) {
      return;
    }
    const { left, right, top, bottom } = (this.el.nativeElement as HTMLElement).getBoundingClientRect();
    if (
      event.clientX >= left &&
      event.clientX <= right &&
      event.clientY >= top &&
      event.clientY <= bottom
    ) {
      this.appDrop.emit();
    }
  }
}
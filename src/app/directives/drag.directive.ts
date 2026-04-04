import { Directive, ElementRef, inject, input, output } from '@angular/core';
import { DragService } from '../services/drag.service';

@Directive({
  selector: '[appDrag]',
  host: {
    '[class.draggable]': 'appDrag()',
    '(pointerdown)': 'appDrag() && dragStart($event)',
    '(document:pointerup)': 'service.stopDragging($event); appDragEnd.emit()',
    '(document:pointermove)': 'service.drag($event)',
  }
})
export class Drag {
  appDrag = input.required<boolean>();
  appDragEnd = output();
  appDragStart = output();
  service = inject(DragService);

  private el = inject(ElementRef);

  dragStart(event: PointerEvent) {
    event.preventDefault(); // voorkomt scroll op mobiel
    const dragging = this.service.startDragging(event, this.el.nativeElement);
    if (dragging) {
      this.appDragStart.emit();
    }
  }
}

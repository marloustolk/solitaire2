import { Directive, ElementRef, inject, input, output } from '@angular/core';
import { DragService } from '../services/drag.service';

@Directive({
  selector: '[appDrag]',
  host: {
    '[class.draggable]': 'appDrag()',
    '(pointerdown)': 'appDrag() && dragStart($event)',
    '(document:pointerup)': 'service.stopDragging(); appDragEnd.emit()',
    '(document:pointermove)': 'service.drag($event)',
  }
})
export class Drag {
  appDrag = input.required<boolean>();
  appDragIndex = input.required<number>();
  appDragEnd = output();
  appDragStart = output();
  service = inject(DragService);

  private el = inject(ElementRef);

  dragStart(event: PointerEvent) {
    event.preventDefault();
    const parent = this.el.nativeElement.parentElement;
    const elements = Array.from(parent.children).slice(this.appDragIndex()) as HTMLElement[];

    const dragging = this.service.startDragging(event, elements);
    if (dragging) {
      this.appDragStart.emit();
    }
  }
}

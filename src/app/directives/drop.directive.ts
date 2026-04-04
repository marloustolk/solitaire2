import { computed, Directive, ElementRef, inject, output } from '@angular/core';
import { DragService } from '../services/drag.service';

@Directive({
  selector: '[appDrop]',
  host: {
    '(document:pointerup)': 'inDropZone() && appDrop.emit()'
  }
})
export class Drop {
  appDrop = output();

  private service = inject(DragService);
  private el = inject(ElementRef);

  inDropZone = computed(() => {
    const dragging = this.service.dragging();
    if (dragging) {
      const { left, right, top, bottom } = (this.el.nativeElement as HTMLElement).getBoundingClientRect();
      const element = dragging[0].getBoundingClientRect();
      const middleX = element.left + dragging[0].offsetWidth / 2
      const middleY = element.top + dragging[0].offsetHeight / 2
      return (middleX >= left && middleX <= right) && (middleY >= top && middleY <= bottom);
    }
    return false;
  })
}

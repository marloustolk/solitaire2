import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DragService {
  dragging = signal<[HTMLElement, number, number] | undefined>(undefined);

  startDragging(event: PointerEvent, element: HTMLElement): boolean {
    if (!this.dragging()) {
      const { left, top, } = element.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;
      this.dragging.set([element, x, y]);

      this.moveElementToPointer(event);
      element.setPointerCapture(event.pointerId);
      return true;
    }
    return false;
  }

  drag(event: PointerEvent) {
    if (this.dragging()) {
      this.moveElementToPointer(event);
    }
  }

  stopDragging(event: PointerEvent) {
    const dragging = this.dragging();
    if (dragging) {
      const element = dragging[0];
      element.style.position = 'static';
      element.style.zIndex = 'unset'
      element.style.left = 'unset';
      element.style.top = 'unset';
      element.releasePointerCapture(event.pointerId);
      this.dragging.set(undefined)
    }
  }

  private moveElementToPointer(event: PointerEvent) {
    const dragging = this.dragging();
    if (dragging) {
      const [element, x, y] = dragging;
      element.style.position = 'absolute';
      element.style.zIndex = '1'
      element.style.left = (event.clientX - x).toString().concat('px');
      element.style.top = (event.clientY - y).toString().concat('px');
    }
  }
}

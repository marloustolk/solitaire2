import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DragService {
  dragging = signal<{
    elements: HTMLElement[];
    startX: number;
    startY: number;
  } | undefined>(undefined);

  startDragging(event: PointerEvent, elements: HTMLElement[]): boolean {
    if (!this.dragging()) {
      this.dragging.set({ elements, startX: event.clientX, startY: event.clientY });
      elements.forEach(element => element.style.zIndex = '2');
      return true;
    }
    return false;
  }

  drag(event: PointerEvent) {
    if (this.dragging()) {
      this.moveElements(event);
    }
  }

  stopDragging() {
    const dragging = this.dragging();
    if (dragging) {
      dragging.elements.forEach(element => {
        element.style.zIndex = '';
        element.style.transform = '';
      });
      this.dragging.set(undefined);
    }
  }

  private moveElements(event: PointerEvent) {
    const dragging = this.dragging();
    if (!dragging) return;
    const { elements, startX, startY } = dragging;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    elements.forEach(element => element.style.transform = `translate(${dx}px, ${dy}px)`);
  }
}

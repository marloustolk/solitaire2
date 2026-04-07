import { Component, input, model, output } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { Card } from '../../model/card.model';
import { Drag } from "../../directives/drag.directive";


@Component({
  selector: 'app-stock',
  imports: [CardComponent, Drag],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss',
})
export class StockComponent {
  id = input.required<number>();
  cards = model<Card[]>([]);
  open = model<Card[]>([]);
  dragging = model<{ from: number, cards: Card[] }>();
  toFoundation = output<{ from: number, card: Card }>();
  save = output<{ from: number, to: number, cards: Card[] }>();
  animate = false;

  async flip(): Promise<void> {
    let closed = this.cards();
    let open = this.open();

    if (closed.length === 0) {
      this.save.emit({ from: 1, to: 0, cards: [...open] });
      open.forEach(card => card.closed = true);
      this.cards.set(open.reverse());
      this.open.set([]);
    } else {
      closed[closed.length - 1].closed = false;
      await new Promise(resolve => setTimeout(resolve, 250));
      const toFlip = closed.pop()!;
      this.save.emit({ from: 0, to: 1, cards: [{ value: toFlip.value, closed: true }] });
      this.open.set([...this.open(), toFlip]);
      this.animate = true;
      await new Promise(resolve => setTimeout(resolve, 5));
      this.animate = false;
    }
  }
}

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
    this.animate = true;
    let closed = this.cards();
    let open = this.open();

    if (closed.length === 0) {
      this.save.emit({ from: 1, to: 0, cards: open });

      this.cards.set(open.map(card => { return { value: card.value, closed: true } }).reverse());
      this.open.set([]);
    } else {
      closed[closed.length - 1].closed = false;
      await this.sleep(200);

      const toFlip = closed.pop()!;
      this.save.emit({ from: 0, to: 1, cards: [{ value: toFlip.value, closed: true }] });
      this.open.set([...open, toFlip]);

      await this.sleep(10);
    }
    this.animate = false;
  }

  private async sleep(miliseconds: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, miliseconds));
  }
}

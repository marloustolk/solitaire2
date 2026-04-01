import { Component, input, model, output } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { Card } from '../../model/card.model';


@Component({
  selector: 'app-stock',
  imports: [CardComponent],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss',
})
export class StockComponent {
  id = input.required<number>();
  cards = model<Card[]>([]);
  open = model<Card[]>([]);
  dragging = model<[number, Card[]]>();
  tryMove = output<[number, Card]>();

  flip(): void {
    let closed = this.cards();
    let open = this.open();

    if (closed.length === 0) {
      open.forEach(card => card.closed = true);
      this.cards.set(open.reverse());
      this.open.set([]);
    } else {
      const toFlip = closed.shift()!;
      toFlip.closed = false;
      this.open.set([toFlip, ...this.open()]);
    }
  }
}

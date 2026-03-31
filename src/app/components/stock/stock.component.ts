import { Component, model, output } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { Card } from '../../model/card.model';


@Component({
  selector: 'app-stock',
  imports: [CardComponent],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss',
})
export class StockComponent {
  cards = model<Card[]>([]);
  open = model<Card[]>([]);
  dropped = model<boolean>();
  toFoundation = output<[number, Card]>();

  test() {
    console.log(this.open().length > 0)
    console.log(this.open().length > 0 ? this.open()[this.open().length - 1] : 'meh')
  }
  flip(): void {
    let cards = this.cards();

    if (cards.length === 0) {
      cards = this.open().map(card => { card.closed = true; return card; });
      this.open.set([]);
    } else {
      const toFlip = cards.shift()!;
      toFlip.closed = false;
      this.open.set([...this.open(), toFlip]);
    }
    this.cards.set(cards);
  }

  dragstart(event: DragEvent): void {
    const cardId = ((event.target! as HTMLElement).firstChild as HTMLElement).id;
    event.dataTransfer!.setData("cards", cardId);
    this.dropped.set(false);
  }

  dragend(event: DragEvent): void {
    if (this.dropped()) {
      this.removeCard(event.dataTransfer!.getData("cards"));
    }
  }

  private removeCard(cardId: string): void {
    this.open.set(this.open().filter(card => card.value !== cardId));
  }
}

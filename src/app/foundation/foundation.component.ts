import { Component, input, model, output } from '@angular/core';
import { Card, isOneRankHigher, isAce } from '../model/card.model';
import { CardComponent } from '../components/card/card.component';

@Component({
  selector: 'app-foundation',
  imports: [CardComponent],
  templateUrl: './foundation.component.html',
  styleUrl: './foundation.component.scss',
})
export class FoundationComponent {
  id = input.required<number>();
  cards = input<Card[]>([]);
  dragging = model<[number, Card[]]>();
  dropped = output<number>();

  dragstart(): void {
    const card = this.cards()[this.cards().length - 1];
    this.dragging.set([this.id(), [card]]);
  }

  canPlace(): boolean {
    const cards = this.cards();
    const cardToPlace = this.dragging()![1][0];
    const currentTopCard = cards.length > 0 ? cards[0] : undefined;
    if (currentTopCard && cardToPlace.value.substring(0, 1) === currentTopCard.value.substring(0, 1)) {
      return isOneRankHigher(cardToPlace, currentTopCard);
    }
    return !currentTopCard && isAce(cardToPlace);
  }
}

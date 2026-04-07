import { Component, input, model, output } from '@angular/core';
import { Card, isKing, isOneRankHigher, isRed } from '../../model/card.model';
import { CardComponent } from '../card/card.component';
import { Drag } from '../../directives/drag.directive';
import { Drop } from '../../directives/drop.directive';

@Component({
  selector: 'app-pile',
  imports: [CardComponent, Drag, Drop],
  templateUrl: './pile.component.html',
  styleUrl: './pile.component.scss',
})
export class PileComponent {
  id = input.required<number>();
  cards = input<Card[]>([]);
  dragging = model<{ from: number, cards: Card[] }>();
  dropped = output<number>();
  toFoundation = output<{ from: number, card: Card }>();

  draggable(index: number): boolean {
    return !this.cards()[index].closed;
  }

  dragstart(index: number): void {
    if (!this.dragging() && this.draggable(index)) {
      const cards = this.cards().filter((_card, i) => i >= index);
      this.dragging.set({ from: this.id(), cards });
    }
  }

  canPlace(): boolean {
    const dragging = this.dragging();
    if (!dragging) {
      return false;
    }
    const cardToPlace = dragging.cards[0];
    const topCard = this.topCard();
    if (topCard && isRed(cardToPlace) !== isRed(topCard)) {
      return isOneRankHigher(topCard, cardToPlace);
    }
    return !topCard && isKing(cardToPlace);
  }

  private topCard(): Card | undefined {
    const cards = this.cards();
    return cards.length > 0 ? cards[cards.length - 1] : undefined;
  }
}

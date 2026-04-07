import { Component, input, model, output } from '@angular/core';
import { Card, isOneRankHigher, isAce } from '../../model/card.model';
import { CardComponent } from '../card/card.component';
import { Drag } from "../../directives/drag.directive";
import { Drop } from '../../directives/drop.directive';

@Component({
  selector: 'app-foundation',
  imports: [CardComponent, Drag, Drop],
  templateUrl: './foundation.component.html',
  styleUrl: './foundation.component.scss',
})
export class FoundationComponent {
  id = input.required<number>();
  cards = input<Card[]>([]);
  dragging = model<{ from: number, cards: Card[] }>();
  dropped = output<number>();

  dragstart(): void {
    const card = this.cards()[this.cards().length - 1];
    this.dragging.set({ from: this.id(), cards: [card] });
  }

  canPlace(): boolean {
    const dragging = this.dragging();
    if (!dragging) {
      return false;
    }
    const cardToPlace = dragging.cards[0];
    const currentTopCard = this.cards().length > 0 ? this.cards()[this.cards().length - 1] : undefined;
    if (currentTopCard && cardToPlace.value.substring(0, 1) === currentTopCard.value.substring(0, 1)) {
      return isOneRankHigher(cardToPlace, currentTopCard);
    }
    return !currentTopCard && isAce(cardToPlace);
  }
}

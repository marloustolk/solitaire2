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
  dragging = model<[number, Card[]]>();
  dropped = output<number>();

  dragstart(): void {
    const card = this.cards()[0];
    this.dragging.set([this.id(), [card]]);
  }

  canPlace(): boolean {
    const dragging = this.dragging();
    if (!dragging) {
      return false;
    }
    const cardToPlace = dragging[1][0];
    const currentTopCard = this.cards().length > 0 ? this.cards()[0] : undefined;
    if (currentTopCard && cardToPlace.value.substring(0, 1) === currentTopCard.value.substring(0, 1)) {
      return isOneRankHigher(cardToPlace, currentTopCard);
    }
    return !currentTopCard && isAce(cardToPlace);
  }
}

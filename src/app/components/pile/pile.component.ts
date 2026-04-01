import { Component, input, model, output } from '@angular/core';
import { Card, isKing, isOneRankHigher, isRed } from '../../model/card.model';
import { CardComponent } from '../card/card.component';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-pile',
  imports: [CardComponent, NgTemplateOutlet],
  templateUrl: './pile.component.html',
  styleUrl: './pile.component.scss',
})
export class PileComponent {
  id = input.required<number>();
  cards = input<Card[]>([]);
  dragging = model<[number, Card[]]>();
  dropped = output<number>();
  tryMove = output<[number, Card]>();

  flip(): void {
    const topCard = this.cards()?.[0] ?? undefined;
    if (topCard) {
      topCard.closed = false;
    }
  }

  draggable(index: number): boolean {
    return !this.cards()[index].closed;
  }

  isDragging(index: number): boolean {
    const dragging = this.dragging();
    return dragging ? dragging[0] === this.id() && dragging[1].includes(this.cards()[index]) : false;
  }

  dragstart(index: number): void {
    if (!this.dragging() && this.draggable(index)) {
      const cards = this.cards().filter((_card, i) => i <= index).reverse();
      this.dragging.set([this.id(), cards]);
    }
  }

  canPlace(): boolean {
    const cardToPlace = this.dragging()![1][0];
    const currentTopCard = this.cards()?.[0] ?? undefined;
    if (currentTopCard && currentTopCard.closed) {
      return false;
    }
    if (currentTopCard && isRed(cardToPlace) !== isRed(currentTopCard)) {
      return isOneRankHigher(currentTopCard, cardToPlace);
    }
    return !currentTopCard && isKing(cardToPlace);
  }
}

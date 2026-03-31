import { Component, model } from '@angular/core';
import { Card, isOneRankHigher, isAce } from '../model/card.model';
import { CardComponent } from '../components/card/card.component';

@Component({
  selector: 'app-foundation',
  imports: [CardComponent],
  templateUrl: './foundation.component.html',
  styleUrl: './foundation.component.scss',
})
export class FoundationComponent {
  cards = model<Card[]>([]);
  dropped = model<boolean>();

  dragstart(event: DragEvent): void {
    const cardId = ((event.target! as HTMLElement).firstChild as HTMLElement).id;
    console.log(cardId)
    event.dataTransfer!.setData("cards", cardId);
    this.dropped.set(false);
  }

  dragover(event: DragEvent): void {
    if (this.canPlace(event)) {
      event.preventDefault();
    }
  }

  dragend(event: DragEvent): void {
    if (this.dropped()) {
      this.removeCard(event.dataTransfer!.getData("cards"));
    }
  }

  drop(event: DragEvent): void {
    const cardId = event.dataTransfer!.getData("cards");
    this.addCard({ value: cardId, closed: false });
    this.dropped.set(true);
  }

  canPlace(event: DragEvent): boolean {
    const card = { value: event.dataTransfer!.getData("cards"), closed: false };
    if (this.cardAlreadyInPile(card)) {
      return false;
    }
    const currentTopCard = this.cards().length > 0 ? this.cards()[this.cards().length - 1] : undefined;
    if (currentTopCard && card.value.substring(0, 1) === currentTopCard.value.substring(0, 1)) {
      return isOneRankHigher(card, currentTopCard);
    }
    return !currentTopCard && isAce(card);
  }

  private cardAlreadyInPile(newCard: Card): boolean {
    return this.cards().some(card => card.value === newCard.value);
  }

  private addCard(card: Card): void {
    const existingCards = this.cards() ?? [];
    this.cards.set([...existingCards, card]);
  }

  private removeCard(cardId: string): void {
    this.cards.set(this.cards()?.filter(card => card.value !== cardId));
  }
}

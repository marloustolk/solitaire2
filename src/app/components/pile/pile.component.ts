import { Component, input, model, OnInit, output } from '@angular/core';
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
  cards = model<Card[]>([]);
  dropped = model<boolean>();
  toFoundation = output<[number, Card]>();

  flip(): void {
    const topCard = this.cards()?.[0] ?? undefined;
    if (topCard) {
      topCard.closed = false;
    }
  }

  dragstart(event: DragEvent): void {
    const id = (event.target! as HTMLElement).id;
    const cardIds = this.getCardIds(document.getElementById(id)!);
    event.dataTransfer!.setData("cards", cardIds);
    this.dropped.set(false);
  }

  dragover(event: DragEvent): void {
    if (this.canPlace(event)) {
      event.preventDefault();
    }
  }

  dragend(event: DragEvent): void {
    if (this.dropped()) {
      this.removeCards(event.dataTransfer!.getData("cards"));
    }
  }

  drop(event: DragEvent): void {
    const cards = this.getCards(event.dataTransfer!.getData("cards"));
    this.addCards(cards);
    this.dropped.set(true);
  }

  canPlace(event: DragEvent): boolean {
    const cards = this.getCards(event.dataTransfer!.getData("cards"));
    if (this.cardsAlreadyInPile(cards)) {
      return false;
    }
    const cardToPlace = cards[0];
    const currentTopCard = this.cards()?.[0] ?? undefined;
    if (currentTopCard && isRed(cardToPlace) !== isRed(currentTopCard)) {
      return isOneRankHigher(currentTopCard, cardToPlace);
    }
    return isKing(cardToPlace);
  }

  private cardsAlreadyInPile(cards: Card[]): boolean {
    return this.cards().some(card => card.value === cards[0].value);
  }

  private addCards(cards: Card[]): void {
    const existingCards = this.cards() ?? [];
    this.cards.set([...cards.reverse(), ...existingCards]);
  }

  private removeCards(cardIds: string): void {
    this.cards.set(this.cards()?.filter(card => !cardIds.includes(card.value)));
  }

  private getCards(cardIds: string): Card[] {
    return cardIds.split(',').map(id => { return { value: id, closed: false } });
  }

  private getCardIds(element: HTMLElement): string {
    const cardIds: string[] = [];
    let places = element.childNodes!;
    do {
      cardIds.push((places[0].firstChild as HTMLElement).id)
      places = places[1].childNodes!
    } while (places.length > 0)
    return cardIds.join();
  }
}

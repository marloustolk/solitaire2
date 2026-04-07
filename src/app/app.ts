import { Component, effect, model, OnInit } from '@angular/core';
import { PileComponent } from './components/pile/pile.component';
import { Card, cardDeck, isAce, isOneRankHigher, suitIsSame } from './model/card.model';
import { FoundationComponent } from './components/foundation/foundation.component';
import { StockComponent } from './components/stock/stock.component';
import { Menu } from "./menu/menu";

@Component({
  selector: 'app-root',
  imports: [PileComponent, FoundationComponent, StockComponent, Menu],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  CLOSED_STOCK = 0;
  OPEN_STOCK = 1;
  FOUNDATIONS = [2, 3, 4, 5];
  PILES = [6, 7, 8, 9, 10, 11, 12];

  playingCards: Card[][] = [];
  dragging = model<{ from: number, cards: Card[] }>();
  finish = model<boolean>(false);
  moves: { from: number, to: number, cards: Card[], flipped: boolean }[] = [];
  private deck: Card[] = [];

  constructor() {
    effect(() => {
      if (
        !this.dragging() &&
        this.playingCards[this.CLOSED_STOCK].length === 0 &&
        this.playingCards[this.OPEN_STOCK].length < 2 &&
        this.PILES.every((i) => this.playingCards[i].every((card) => !card.closed))
      ) {
        this.finish.set(true);
      }
    });
  }

  ngOnInit() {
    this.newGame();
  }

  restart(): void {
    this.startGame();
  }

  newGame(): void {
    this.deck = cardDeck();
    this.startGame()
  }

  undo() {
    const { from, to, cards, flipped } = this.moves.pop()!;
    if (flipped) {
      const pile = this.playingCards[from]!;
      pile[pile.length - 1].closed = true;
    }
    this.drop(from, { from: to, cards }, true);
  }

  startGame(): void {
    const deck = [...this.deck];
    deck.forEach(c => c.closed = true);
    this.moves = [];
    this.playingCards = [];

    this.PILES.forEach((pile, index) => {
      let cards = deck.splice(0, index + 1);
      cards[cards.length - 1].closed = false;
      this.playingCards[pile] = cards;
    });

    for (let foundation of this.FOUNDATIONS) {
      this.playingCards[foundation] = [];
    }
    this.playingCards[this.CLOSED_STOCK] = deck;
    this.playingCards[this.OPEN_STOCK] = [];
  }

  drop(to: number, dragging: { from: number, cards: Card[] } | undefined, undo?: boolean) {
    if (!dragging) {
      console.log('nothing to drop');
      return;
    }
    this.dragging.set(dragging);
    const { from, cards } = dragging;
    for (let card of cards) {
      this.playingCards[from].pop();
      this.playingCards[to].push(card);
    }
    const flipped = this.flip(from);
    if (!undo) {
      this.moves.push({ from, to, cards, flipped });
    }
    this.dragging.set(undefined);
  }

  flip(from: number): boolean {
    if (this.PILES.includes(from)) {
      const pile = this.playingCards[from];
      const topCard = pile.length > 0 ? pile[pile.length - 1] : undefined;
      if (topCard?.closed) {
        topCard.closed = false;
        return true;
      }
    }
    return false;
  }

  toFoundation(from: number, card: Card) {
    for (let foundation of this.FOUNDATIONS) {
      const pile = this.playingCards[foundation];
      const topCard = pile.length > 0 ? pile[pile.length - 1] : undefined;
      if (
        (!topCard && isAce(card)) ||
        (topCard && suitIsSame(card, topCard) && isOneRankHigher(card, topCard))
      ) {
        this.drop(foundation, { from, cards: [card] });
        return;
      }
    }
  }
}

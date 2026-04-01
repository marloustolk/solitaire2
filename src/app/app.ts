import { Component, effect, model, OnInit } from '@angular/core';
import { PileComponent } from './components/pile/pile.component';
import { Card, cardDeck, isAce, isOneRankHigher, suitIsSame } from './model/card.model';
import { FoundationComponent } from './foundation/foundation.component';
import { StockComponent } from './components/stock/stock.component';

@Component({
  selector: 'app-root',
  imports: [PileComponent, FoundationComponent, StockComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  CLOSED_STOCK = 0;
  OPEN_STOCK = 1;
  FOUNDATIONS = [2, 3, 4, 5];
  PILES = [6, 7, 8, 9, 10, 11, 12];

  playingCards: Card[][] = [];
  dragging = model<[number, Card[]]>();
  finish = model<boolean>(false);

  constructor() {
    effect(() => {
      if (!this.dragging() && this.PILES.every((i) => this.playingCards[i].every((card) => !card.closed))) {
        this.finish.set(true);
      }
    });
  }

  ngOnInit() {
    this.startGame();
  }

  startGame(): void {
    const deck = cardDeck();
    this.playingCards = [];

    this.PILES.forEach((pile, index) => {
      let cards = deck.splice(0, index + 1);
      cards[0].closed = false;
      this.playingCards[pile] = cards;
    });

    for (let foundation of this.FOUNDATIONS) {
      this.playingCards[foundation] = [];
    }
    this.playingCards[this.CLOSED_STOCK] = deck;
    this.playingCards[this.OPEN_STOCK] = [];
  }

  drop(to: number, dragging: [number, Card[]] | undefined) {
    if (!dragging) {
      console.log('nothing to drop');
      return;
    }
    this.dragging.set(dragging);
    const [from, cards] = dragging;
    for (let card of cards) {
      this.playingCards[from].shift();
      this.playingCards[to].unshift(card);
    }
    this.dragging.set(undefined);
  }

  tryMove([from, card]: [number, Card]) {
    for (let foundation of this.FOUNDATIONS) {
      const pile = this.playingCards[foundation];
      const topCard = pile.length > 0 ? pile[0] : undefined;
      if (
        (!topCard && isAce(card)) ||
        (topCard && suitIsSame(card, topCard) && isOneRankHigher(card, topCard))
      ) {
        this.drop(foundation, [from, [card]]);
        return;
      }
    }
  }
}

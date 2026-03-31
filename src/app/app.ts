import { Component, effect, model, OnInit, Signal, signal } from '@angular/core';
import { PileComponent } from './components/pile/pile.component';
import { Card, cardDeck, isAce, isOneRankHigher, suitIsSame } from './model/card.model';
import { FoundationComponent } from './foundation/foundation.component';
import { StockComponent } from './components/stock/stock.component';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [PileComponent, FoundationComponent, StockComponent, NgTemplateOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  finish = signal<boolean>(false);
  dropped = model<boolean>(false);
  piles = [
    signal<Card[]>([]),
    signal<Card[]>([]),
    signal<Card[]>([]),
    signal<Card[]>([]),
    signal<Card[]>([]),
    signal<Card[]>([]),
    signal<Card[]>([]),
  ];
  foundations = [signal<Card[]>([]), signal<Card[]>([]), signal<Card[]>([]), signal<Card[]>([])];
  deck = signal<Card[]>([]);
  open = signal<Card[]>([]);

  constructor() {
    effect(() => {
      if (
        this.piles.every((pile) => pile().every((card) => !card.closed)) &&
        this.deck().length === 0 &&
        this.open().length < 2
      ) {
        this.finish.set(true);
      }
    });
  }

  ngOnInit() {
    this.startGame();
  }

  startGame(): void {
    const deck = cardDeck();

    for (let i = 0; i < 7; i++) {
      let cards = deck.splice(0, i + 1);
      this.piles[i].set(cards);
    }
    for (let i = 0; i < 4; i++) {
      this.foundations[i].set([]);
    }
    this.deck.set(deck);
    this.piles.forEach((pile) => (pile()[0].closed = false));
  }

  toFoundation(event: [number, Card]) {
    const [i, card] = event;
    for (let foundation of this.foundations) {
      const topFoundation =
        foundation().length > 0 ? foundation()[foundation().length - 1] : undefined;
      if (
        (!topFoundation && isAce(card)) ||
        (topFoundation && suitIsSame(card, topFoundation) && isOneRankHigher(card, topFoundation))
      ) {
        if (i === 7) {
          const open = this.open();
          open.pop();
          this.open.set(open);
        } else {
          const pile = this.piles[i]();
          pile.shift();
          this.piles[i].set(pile);
        }
        foundation.set([...foundation(), card]);
        return;
      }
    }
  }
}

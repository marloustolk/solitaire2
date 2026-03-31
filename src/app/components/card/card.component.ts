import { Component, input } from '@angular/core';
import { Card, isRed } from '../../model/card.model';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  card = input.required<Card>();

  getColor(): string {
    return isRed(this.card()) ? "#b01030" : "#000000";
  }

  getRankOfSuits(): string {
    const suit = this.card().value.substring(0, 1);
    const rank = this.card().value.substring(1);
    switch (rank) {
      case 'A': return suit;
      case 'J':
      case 'Q':
      case 'K': return rank;
      default: return suit;
      // TODO: default: return Array.from(Array(parseInt(rank)).keys()).map(nr => suit).join(' ');
    }
  }
}

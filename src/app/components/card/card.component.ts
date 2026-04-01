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

  getRank(): string {
    return this.card().value.substring(1);
  }

  getSuits(): string[] {
    const suit = this.card().value.substring(0, 1);
    const rank = this.getRank();

    switch (rank) {
      case 'J':
      case 'Q':
      case 'K':
        return [rank];
      case 'A':
        return [suit];
      default:
        return Array.from(Array(parseInt(rank)).keys()).map(() => suit);
    }
  }
}

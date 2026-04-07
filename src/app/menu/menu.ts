import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  notStarted = input.required<boolean>();
  newGame = output<void>();
  restart = output<void>();
  undo = output<void>();
}

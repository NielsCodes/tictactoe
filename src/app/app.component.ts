import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  constructor() {
    const winner = this.checkWinner();
    console.log(winner);
  }

  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]
  available = 9;
  player: 'human' | 'ai' = 'human';
  winner: string| null = null;

  playSpace(y: number, x: number) {
    let character = 'X';
    if (this.player === 'ai') {
      character = 'O';
      this.player = 'human';
    } else {
      this.player = 'ai';
    }
    this.board[y][x] = character;
    this.checkWinner();
  }

  checkWinner() {
    const b = this.board;

    for (let i = 0; i < 3; i++) {
      // Check column
      if (this.isFullLine(b[i][0], b[i][1], b[i][2])) {
        this.winner = b[i][0];
      }

      // Check row
      if (this.isFullLine(b[0][i], b[1][i], b[2][i])) {
        this.winner = b[0][i];
      }
    }

    // Check diagonals
    if (
      this.isFullLine(b[0][0], b[1][1], b[2][2]) ||
      this.isFullLine(b[0][2], b[1][1], b[2][0])
    ) {
      this.winner = b[1][1];
    }

    // If ther is no winner and no available spots are left, game ends in tie
    if (!!this.winner && this.available === 0) {
      this.winner = 'tie';
    }
    return this.winner;
  }

  /**
   * Check if a full line is both filled and the same player
   * @param a first field in line
   * @param b second field in line
   * @param c third field in line
   * @returns whether the line is full (won by player)
   */
  isFullLine(a: string, b: string, c: string) {
    return (a === b && b === c && a !== '');
  }

  resetGame() {
    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
    this.available = 9;
    this.winner = null;
  }

  bestMove() {

  }

  minimax(board: string[][], depth: number, isMaximizing: boolean) {

  }

}

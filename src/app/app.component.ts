import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  constructor() { }

  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  scores: {[key: string]: number} = {
    X: -1,
    O: 1,
    tie: 0,
  };

  player: 'X' |'O' = 'X';
  winner: string | null = null;

  playSpace(y: number, x: number) {
    this.board[y][x] = this.player;
    if (this.player === 'X') {
      this.player = 'O';
      this.moveAi();
    } else {
      this.player = 'X';
    }
    this.winner = this.checkWinner(this.board);
  }

  moveAi() {
    const [score, position] = this.minimax(this.board, true);
    console.log(score, position);
    if (position) {
      this.playSpace(position.i, position.j);
    }
  }

  checkWinner(board: string[][]) {
    let openSpaces = 0;

    if (
      this.isFullLine(board[0][0], board[1][1], board[2][2]) ||
      this.isFullLine(board[2][0], board[1][1], board[0][2])
    ) {
      return board[1][1];
    }

    for (let i=0; i < 3; i++) {

      if (this.isFullLine(board[i][0], board[i][1], board[i][2])) {
        return board[i][0];
      }

      if (this.isFullLine(board[0][i], board[1][i], board[2][i])) {
        return board[0][i];
      }

      for (let j=0; j < 3; j++) {
        if (board[i][j] === '') openSpaces++;
      }

    }

    if (openSpaces === 0) {
      return 'tie';
    }

    return null;
  }

  /**
   * Check if a full line is both filled and the same player
   * @param a first field in line
   * @param b second field in line
   * @param c third field in line
   * @returns whether the line is full (won by player)
   */
  isFullLine(a: string, b: string, c: string) {
    return a === b && b === c && a !== '';
  }

  /**
   * Recursively select board positions to maximize or minimize the outcome score.
   * @param board 2D array representation of the current board state
   * @param isMaximizing whether current player is maximizing or minimizing
   * @returns the best score and position
   */
  minimax(board: string[][], isMaximizing: boolean): [number, {i: number, j: number} | null] {
    // Recursive base case
    const winner = this.checkWinner(board);
    if (winner !== null) {
      return [this.scores[winner], null];
    }

    let maxScore = -Infinity;
    let maxPos = null;
    let minScore = Infinity;
    let minPos = null;

    // Pick character based on isMaximizing
    // is maximizing --> O
    // is not maximizing --> X
    const character = isMaximizing ? 'O' : 'X';

    // Loop through each space on board
    // Check if field is playable (=== '')
    // Place current player's character in the space
    // Call minimax recursively from there
    for (let i=0; i < 3; i++) {
      for (let j=0; j < 3; j++) {
        if (board[i][j] === '') {

          board[i][j] = character;
          let [score] = this.minimax(board, !isMaximizing);
          board[i][j] = '';

          if (score > maxScore) {
            maxScore = score;
            maxPos = {i,j};
          }

          if (score < minScore) {
            minScore = score;
            minPos = {i,j};
          }
        }
      }
    }

    if (isMaximizing) {
      return [maxScore, maxPos];
    } else {
      return [minScore, minPos];
    }
  }

  /** Reset the game state */
  resetGame() {
    this.winner = null;
    this.player = 'X';
    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
  }

}

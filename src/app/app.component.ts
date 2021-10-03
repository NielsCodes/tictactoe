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

  winningBoard = [
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ];

  scores: {[key: string]: number} = {
    X: -1,
    O: 1,
    tie: 0,
  };

  player: 'X' |'O' = 'X';
  winner: string | null = null;

  /**
   * Add the current player's character to the board at the specified position
   * @param y the y coordinate to play (0-2)
   * @param x the x coordinate to play (0-2)
   */
  playSpace(y: number, x: number) {
    this.board[y][x] = this.player;
    if (this.player === 'X') {
      this.player = 'O';
      this.moveAi();
    } else {
      this.player = 'X';
    }
    const [winner, winningBoard] = this.checkWinner(this.board);
    this.winner = winner;
    if (winner !== null && winner !== 'tie') {
      this.winningBoard = winningBoard!;
    }
  }

  /** Use the minimax algorithm to find the optimal move for the AI player
   * - Uses playSpace to make the move on the board
   */
  moveAi() {
    const [score, position] = this.minimax(this.board, true);
    if (position) {
      this.playSpace(position.i, position.j);
    }
  }

  /**
   * Check if game representation has reached an end state
   * - Returns null if game has not yet ended
   * - Returns 'tie' if game has reached a tie
   * - Returns the character of a winner and a representation of the winning line if game is won
   * @param board a 2D array representation of the board
   * @returns the winner and winning line representation
   */
  checkWinner(board: string[][]): [string | null, boolean[][] | null] {
    let openSpaces = 0;

    const winningBoard = [
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ];

    // Check diagonals
    if (this.isFullLine(board[0][0], board[1][1], board[2][2])) {
      winningBoard[0][0] = true;
      winningBoard[1][1] = true;
      winningBoard[2][2] = true;
      return [board[1][1], winningBoard];
    }
    if (this.isFullLine(board[2][0], board[1][1], board[0][2])) {
      winningBoard[2][0] = true;
      winningBoard[1][1] = true;
      winningBoard[0][2] = true;
      return [board[1][1], winningBoard];
    }

    // Check rows
    for (let i=0; i < 3; i++) {

      if (this.isFullLine(board[i][0], board[i][1], board[i][2])) {
        winningBoard[i][0] = true;
        winningBoard[i][1] = true;
        winningBoard[i][2] = true;
        return [board[i][0], winningBoard];
      }

      if (this.isFullLine(board[0][i], board[1][i], board[2][i])) {
        winningBoard[0][i] = true;
        winningBoard[1][i] = true;
        winningBoard[2][i] = true;
        return [board[0][i], winningBoard];
      }

      // Count open spaces
      for (let j=0; j < 3; j++) {
        if (board[i][j] === '') openSpaces++;
      }

    }

    if (openSpaces === 0) {
      return ['tie', null];
    }

    return [null, null];
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
    const [winner] = this.checkWinner(board);
    if (winner) {
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
        if (board[i][j] !== '') continue;

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
    this.winningBoard = [
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ];
  }

}

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

    const character = isMaximizing ? 'O' : 'X';

    // if (isMaximizing) {
    //   for (let i=0; i<3; i++) {
    //     for (let j=0; j<3; j++) {
    //       if (board[i][j] !== '') {
    //         board[i][j] = character;
    //         const [score] = this.minimax(board, false);
    //         board[i][j] = '';
    //         if (score > maxScore) {
    //           maxScore = score;
    //           maxPos = {i,j};
    //         }
    //       }
    //     }
    //   }
    //   return [maxScore, maxPos];
    // } else {
    //   for (let i=0; i<3; i++) {
    //     for (let j=0; j<3; j++) {
    //       if (board[i][j] !== '') {
    //         board[i][j] = character;
    //         const [score] = this.minimax(board, true);
    //         board[i][j] = '';
    //         if (score < minScore) {
    //           minScore = score;
    //           minPos = {i,j};
    //         }
    //       }
    //     }
    //   }
    //   return [minScore, minPos];
    // }


    // Loop through each space on board
    // Check if field is playable (=== '')
    // Place current player's character in the space
    // Call minimax recursively from there
    // If the score for this position is better than current best, store score and position

    for (let i=0; i < 3; i++) {
      for (let j=0; j < 3; j++) {
        if (board[i][j] === '') {

          board[i][j] = character;
          const [score] = this.minimax(board, !isMaximizing);
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


  // // TIE BOARD
  // // board = [
  // //   ['X', 'O', 'X'],
  // //   ['O', 'X', 'X'],
  // //   ['O', 'X', 'O']
  // // ]
  // player: 'human' | 'ai' = 'human';
  // winner: string | null = null;
  // iterations = 0;

  // playSpace(y: number, x: number) {
  //   let character;

  //   if (this.player === 'human') {
  //     character = 'X';
  //     this.player = 'ai';
  //     this.moveAi();
  //   } else {
  //     character = 'O';
  //     this.player = 'human';
  //   }
  //   this.board[y][x] = character;
  // }

  // checkWinner(b: string[][]) {
  //   // const b = this.board;
  //   this.winner = null;
  //   let openSpaces = 0;

  //   for (let i = 0; i < 3; i++) {
  //     // Check column
  //     if (this.isFullLine(b[i][0], b[i][1], b[i][2])) {
  //       this.winner = b[i][0];
  //     }

  //     // Check row
  //     if (this.isFullLine(b[0][i], b[1][i], b[2][i])) {
  //       this.winner = b[0][i];
  //     }

  //     // Check available spaces
  //     for (let j = 0; j < 3; j++) {
  //       if (b[i][j] === '') {
  //         openSpaces++;
  //       }
  //     }
  //   }

  //   // Check diagonals
  //   if (
  //     this.isFullLine(b[0][0], b[1][1], b[2][2]) ||
  //     this.isFullLine(b[0][2], b[1][1], b[2][0])
  //   ) {
  //     this.winner = b[1][1];
  //   }

  //   // If there is no winner and no available spots are left, game ends in tie
  //   if (this.winner === null && openSpaces === 0) {
  //     this.winner = 'tie';
  //   }
  //   return this.winner;
  // }

  // /**
  //  * Check if a full line is both filled and the same player
  //  * @param a first field in line
  //  * @param b second field in line
  //  * @param c third field in line
  //  * @returns whether the line is full (won by player)
  //  */
  // isFullLine(a: string, b: string, c: string) {
  //   return a === b && b === c && a !== '';
  // }

  // resetGame() {
  //   this.board = [
  //     ['', '', ''],
  //     ['', '', ''],
  //     ['', '', ''],
  //   ];
  //   this.winner = null;
  //   this.player = 'human';
  // }

  // moveAi() {
  //   const [score, position] = this.minimax([...this.board], 0, true);
  //   console.log({
  //     score,
  //     position
  //   })
  //   if (position) {
  //     this.playSpace(position.i, position.j);
  //   };
  // }

  // minimax(
  //   board: string[][],
  //   depth: number,
  //   isMaximizing: boolean
  // ): [number, { i: number; j: number } | null] {
  //   this.iterations++;

  //   // if (this.iterations <= 100000) return [-100, null];
  //   const scores: { [key: string]: number } = {
  //     X: -10,
  //     O: 10,
  //     tie: 0,
  //   };
  //   const winner = this.checkWinner(board);
  //   const multiplier = depth * 0.25;
  //   if (winner) return [scores[winner] * multiplier, null];

  //   let maxScore = -Infinity;
  //   let maxPosition = null;
  //   let minScore = Infinity;
  //   let minPosition = null;

  //   const character = isMaximizing ? 'O' : 'X';

  //   for (let i = 0; i < 3; i++) {
  //     for (let j = 0; j < 3; j++) {
  //       if (board[i][j] !== '') continue;

  //       board[i][j] = character;
  //       let [score] = this.minimax([...board], depth +1, !isMaximizing);
  //       board[i][j] = '';

  //       if (score > maxScore) {
  //         maxScore = score;
  //         maxPosition = { i, j };
  //       }

  //       if (score < minScore) {
  //         minScore = score;
  //         minPosition = { i, j };
  //       }
  //     }
  //   }

  //   if (isMaximizing) {
  //     return [maxScore, maxPosition];
  //   } else {
  //     return [minScore, minPosition];
  //   }
  // }
}

import { Chess, Move } from 'chess.js';

export type GameStatus = 'playing' | 'checkmate' | 'stalemate' | 'draw';

export class GameEngine {
  private chess: Chess;
  constructor(fen?: string) {
    this.chess = new Chess(fen);
  }

  getFen() {
    return this.chess.fen();
  }

  loadFen(fen: string) {
    this.chess.load(fen);
  }

  reset() {
    this.chess.reset();
  }

  turn() {
    return this.chess.turn();
  }

  movesForSquare(square: string) {
    return this.chess.moves({ square, verbose: true }) as Move[];
  }

  move(from: string, to: string, promotion?: string) {
    try {
      const move = this.chess.move({ from, to, promotion });
      return move as Move;
    } catch {
      return null;
    }
  }

  undo() {
    return this.chess.undo();
  }

  history() {
    return this.chess.history();
  }

  getStatus(): GameStatus {
    if (this.chess.isCheckmate()) return 'checkmate';
    if (this.chess.isStalemate() || this.chess.isDraw()) return 'draw';
    return 'playing';
  }
}

import create from 'zustand';
import { GameEngine } from '@engine/GameEngine';

export type ClockState = { white: number; black: number; active: boolean };

interface GameState {
  engine: GameEngine;
  fen: string;
  moves: string[];
  selected: string | null;
  legalMoves: string[];
  clock: ClockState;
  select: (square: string) => void;
  move: (to: string) => void;
  undo: () => void;
  tick: () => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  engine: new GameEngine(),
  fen: new GameEngine().getFen(),
  moves: [],
  selected: null,
  legalMoves: [],
  clock: { white: 300, black: 300, active: true },
  select: (square) => {
    const engine = get().engine;
    const legal = engine.movesForSquare(square).map((m) => m.to);
    set({ selected: square, legalMoves: legal });
  },
  move: (to) => {
    const { selected, engine, moves } = get();
    if (!selected) return;
    const res = engine.move(selected, to);
    if (res) {
      set({
        fen: engine.getFen(),
        moves: [...moves, res.san],
        selected: null,
        legalMoves: [],
      });
    }
  },
  undo: () => {
    const { engine, moves } = get();
    const last = engine.undo();
    if (last) {
      moves.pop();
      set({
        fen: engine.getFen(),
        moves: [...moves],
        selected: null,
        legalMoves: [],
      });
    }
  },
  tick: () => {
    const { engine, clock } = get();
    if (!clock.active) return;
    const turn = engine.turn();
    set({
      clock: {
        ...clock,
        [turn === 'w' ? 'white' : 'black']:
          clock[turn === 'w' ? 'white' : 'black'] - 1,
      },
    });
  },
  reset: () => {
    const engine = new GameEngine();
    set({
      engine,
      fen: engine.getFen(),
      moves: [],
      selected: null,
      legalMoves: [],
      clock: { white: 300, black: 300, active: true },
    });
  },
}));

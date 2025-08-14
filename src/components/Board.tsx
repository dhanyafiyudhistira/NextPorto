import React from 'react';
import Svg, { Rect, Text as SvgText, Circle } from 'react-native-svg';
import { useGameStore } from '@store/useGameStore';

const BOARD_SIZE = 320;

export const Board: React.FC = () => {
  const { fen, select, move, selected, legalMoves } = useGameStore();
  const board = fenToBoard(fen);

  const onSquarePress = (sq: string) => {
    if (selected && legalMoves.includes(sq)) {
      move(sq);
    } else {
      select(sq);
    }
  };

  return (
    <Svg width={BOARD_SIZE} height={BOARD_SIZE}>
      {board.map((row, r) =>
        row.map((piece, c) => {
          const square = coordToSquare(r, c);
          const isDark = (r + c) % 2 === 1;
          const isSelected = selected === square;
          return (
            <React.Fragment key={square}>
              <Rect
                x={(c * BOARD_SIZE) / 8}
                y={(r * BOARD_SIZE) / 8}
                width={BOARD_SIZE / 8}
                height={BOARD_SIZE / 8}
                fill={isSelected ? '#ff0' : isDark ? '#222' : '#444'}
                onPress={() => onSquarePress(square)}
              />
              {piece && (
                <SvgText
                  x={((c + 0.5) * BOARD_SIZE) / 8}
                  y={((r + 0.7) * BOARD_SIZE) / 8}
                  fontSize="24"
                  fill="#fff"
                  textAnchor="middle"
                >
                  {pieceToUnicode(piece)}
                </SvgText>
              )}
              {legalMoves.includes(square) && (
                <Circle
                  cx={((c + 0.5) * BOARD_SIZE) / 8}
                  cy={((r + 0.5) * BOARD_SIZE) / 8}
                  r={BOARD_SIZE / 32}
                  fill="rgba(255,255,0,0.5)"
                />
              )}
            </React.Fragment>
          );
        })
      )}
    </Svg>
  );
};

function fenToBoard(fen: string): (string | null)[][] {
  const rows = fen.split(' ')[0].split('/');
  return rows.map((row) => {
    const res: (string | null)[] = [];
    for (const c of row) {
      if (/\d/.test(c)) {
        for (let i = 0; i < parseInt(c, 10); i++) res.push(null);
      } else {
        res.push(c);
      }
    }
    return res;
  });
}

function coordToSquare(r: number, c: number): string {
  const files = 'abcdefgh';
  return files[c] + (8 - r);
}

function pieceToUnicode(p: string) {
  const map: Record<string, string> = {
    p: '♟',
    r: '♜',
    n: '♞',
    b: '♝',
    q: '♛',
    k: '♚',
    P: '♙',
    R: '♖',
    N: '♘',
    B: '♗',
    Q: '♕',
    K: '♔',
  };
  return map[p];
}

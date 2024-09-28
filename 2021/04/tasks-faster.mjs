// BINGO!!! this time with a hashmap and reducers to make it much much faster
// This is far more efficient than the previous version, but much less readable by us humans
// Other version: 30ms+
// This version: 7ms+

// Real Data

import { boardsArray, numbers } from './input.mjs';

const boards = Object.fromEntries(boardsArray.map((board, i) => [i, board]));
const originalNumbers = [...numbers];

const numberMap = Object.fromEntries(
  originalNumbers.map((number, i) => [number, i]),
);

function findWinningBoardReducer(boards, numberMap) {
  const [winningBoard, lastIndex] = Object.entries(boards).reduce(
    (acc, [key, board]) => {
      const lastRowIndex = board.reduce((lowest, row) => {
        const index = row.reduce((highest, number) => {
          const index = numberMap[number];
          return index > highest ? index : highest;
        }, 0);
        return index < lowest ? index : lowest;
      }, 1000);
      const lastColIndex = board[0].reduce((lowest, row, column) => {
        const index = board.reduce((highest, row) => {
          const index = numberMap[row[column]];
          return index > highest ? index : highest;
        }, 0);
        return index < lowest ? index : lowest;
      }, 1000);
      const lastIndex =
        lastRowIndex < lastColIndex ? lastRowIndex : lastColIndex;
      return lastIndex < acc[1] ? [key, lastIndex] : acc;
    },
    [0, 1000],
  );
  const boardScore = boards[winningBoard].flat().reduce((acc, current) => {
    return numberMap[current] > lastIndex ? acc + current : acc;
  }, 0);
  return boardScore * originalNumbers[lastIndex];
}

console.time('reduce');
console.log(findWinningBoardReducer(boards, numberMap));
console.timeEnd('reduce');

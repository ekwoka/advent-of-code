// BINGO!!! Loop through numbers, marking off spaces as you go and find winning board

// Real Data

import { boardsArray, numbers } from './input.mjs';

const boards = Object.fromEntries(boardsArray.map((board, i) => [i, board]));
const originalNumbers = [...numbers];


// Sample Data

/* const originalNumbers = [7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13, 6, 15, 25, 12, 22, 18, 20, 8, 19, 3, 26, 1];

const boards = {
  1: [
    [22, 13, 17, 11, 0],
    [8, 2, 23, 4, 24],
    [21, 9, 14, 16, 7],
    [6, 10, 3, 18, 5],
    [1, 12, 20, 15, 19]
  ],
  2: [
    [3, 15, 0, 2, 22],
    [9, 18, 13, 17, 5],
    [19, 8, 7, 25, 23],
    [20, 11, 10, 24, 4],
    [14, 21, 16, 12, 6]
  ],
  3: [
    [14, 21, 17, 24, 4],
    [10, 16, 15, 9, 19],
    [18, 8, 23, 26, 20],
    [22, 11, 13, 6, 5],
    [2, 0, 12, 3, 7]
  ]
}; */

function findWinningBoard(boards, numbers) {
    let selectedNumbers = [];
    let winningBoard;
    
    while (!winningBoard && numbers.length) {
        selectedNumbers.push(numbers.splice(0,1)[0]);
        winningBoard = Object.values(boards).find((board) => checkWinningRows(board, selectedNumbers));
        winningBoard = winningBoard || Object.values(boards).find((board) => checkWinningColumns(board, selectedNumbers));
    }
    return { winningBoard, selectedNumbers };
}

function checkWinningRows(board, numbers) {
    let status = board.map(row => {
        return row.filter(n => !numbers.includes(n)).length === 0;
    })
    return status.some(row => row === true)
}

function checkWinningColumns(board, numbers) {
    let translatedBoard = board[0].map((n, i) => board.map(row => row[i]));
    return checkWinningRows(translatedBoard, numbers);
}

// Get first board to win and 'score' of board when it wins

function task1(boards, numbers) {
    let { winningBoard, selectedNumbers } = findWinningBoard(boards,numbers)
    let remaining = winningBoard.flat().filter(n => !selectedNumbers.includes(n));
    let finalNumber = selectedNumbers.at(-1);
    return finalNumber * remaining.reduce((acc, n) => acc + n);
}

function findLastBoard(boards, numbers) {
    let selectedNumbers = [];
    let remainingBoards = Object.values(boards);


    while (remainingBoards.length > 1 && numbers.length) {
        selectedNumbers.push(numbers.splice(0,1)[0]);
        remainingBoards = remainingBoards.filter((board) => !checkWinningRows(board, selectedNumbers));
        remainingBoards = remainingBoards.filter((board) => !checkWinningColumns(board, selectedNumbers));
    }

    while (!checkWinningRows(remainingBoards[0], selectedNumbers) && !checkWinningColumns(remainingBoards[0], selectedNumbers)) {
        selectedNumbers.push(numbers.splice(0,1)[0]);
    }

    return { lastBoard: remainingBoards[0], selectedNumbers };
}

// Get last board to win and 'score' of board when it wins

function task2(boards, numbers) {
    let { lastBoard, selectedNumbers } = findLastBoard(boards, numbers);
    let remaining = lastBoard.flat().filter(n => !selectedNumbers.includes(n));
    let finalNumber = selectedNumbers.at(-1);
    return finalNumber * remaining.reduce((acc, n) => acc + n);
}


console.log(task1(boards, [...originalNumbers]));

console.log(task2(boards, [...originalNumbers]));

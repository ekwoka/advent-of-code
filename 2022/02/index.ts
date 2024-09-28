/**
 * --- Day 2: Rock Paper Scissors ---
 * Part 1: 00:10:30   3191
 * Part 2: 00:50:51  12767
 */

import { readFile } from 'node:fs/promises';

// Input consists of lines indicating pairs of ABC and XYZ characters
const input: string = await readFile('input.txt', 'utf8');

const typeMap = {
  A: 1, // Rock
  B: 2, // Paper
  C: 3, // Scissors
  X: 1,
  Y: 2,
  Z: 3,
};

const rounds: number[][] = input
  .split('\n')
  .filter(Boolean)
  .map((round: string) =>
    round
      .split(' ')
      .filter(Boolean)
      .map((type) => typeMap[type]),
  );

// Part 1 consists of calculating the score for each round, and then summing the scores
// the first character from ABC indicates the opponents choice (Rock, Paper, Scissors) and the second character from XYZ indicates what move the player should make
const Part1 = (rounds: number[][]) => {
  const scores = rounds.map(([opp, self]) => {
    const result = opp - self;
    if (result === 0) return 3 + self;
    if (result === 1 || result === -2) return self;
    return 6 + self;
  });
  return scores.reduce((a, b) => a + b);
};

// Part 2 is similar to before, but instead of XYZ indicating a players move choice, it indicates whether the player should Lose, Draw, or Win, from there we need to identify the correct move to make for that result
const Part2 = (rounds: number[][]) => {
  const scores = rounds.map(([opp, self]) => {
    const resultScore = (self - 1) * 3;
    const signScore = ((opp + 2 + (self - 2)) % 3) + 1;
    return resultScore + signScore;
  });
  return scores.reduce((a, b) => a + b);
};

console.log('Part 1:', Part1(rounds));
console.log('Part 2:', Part2(rounds));

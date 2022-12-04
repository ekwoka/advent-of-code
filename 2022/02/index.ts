import { readFile } from 'node:fs/promises';

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
      .map((type) => typeMap[type])
  );

const Part1 = (rounds: number[][]) => {
  const scores = rounds.map(([opp, self]) => {
    const result = opp - self;
    if (result === 0) return 3 + self;
    if (result === 1 || result === -2) return self;
    return 6 + self;
  });
  return scores.reduce((a, b) => a + b);
};

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

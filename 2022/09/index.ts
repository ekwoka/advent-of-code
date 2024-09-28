/**
 * --- Day 9: Rope Bridge ---
 * Part 1: 00:31:50   4366
 * Part 2: 01:10:03   5109
 * This is all about simulating physics on ropes!!! I tried to use ChatGPT to get to a working solution for quite some time and that did not work out. But it was fun.
 */

import { readFile } from 'node:fs/promises';

const input: string = await readFile('input.txt', 'utf-8');
const moves = input.split('\n').filter(Boolean);

const areNeighbours = (a: coord, b: coord): boolean =>
  [0, 1].every((i) => Math.abs(a[i] - b[i]) <= 1);

const getMoveChange = (head: coord, tail: coord): coord => {
  const diffs = [0, 1].map((i) => head[i] - tail[i]);
  return diffs.map((num) => Math.max(-1, Math.min(1, num))) as coord;
};

// Both parts are essentially the same problem just with different rope lengths. We need to return the unique positions the far end of the rope has been in. The input is a series of directions and distances to move one end of the rope, and we need to cascade this movement down the rope and update the far end.
const simulateRopes = (moves: string[], ropeLength = 2) => {
  const headPosition: coord = [0, 0];
  const tailPositions: coord[] = [[0, 0]];
  const rope: coord[] = Array.from({ length: ropeLength - 1 }, () => [0, 0]);
  moves.forEach((move) => {
    const [dir, dis] = move.split(' ');
    for (let count = Number(dis); count > 0; count--) {
      switch (dir) {
        case 'U':
          headPosition[1]++;
          break;
        case 'D':
          headPosition[1]--;
          break;
        case 'R':
          headPosition[0]++;
          break;
        case 'L':
          headPosition[0]--;
          break;
      }
      const newTail = rope.reduce(
        (lastKnot, knot: coord, i): coord => {
          if (areNeighbours(lastKnot, knot)) return [...knot] as coord;
          const moveChange = getMoveChange(lastKnot, knot);
          rope[i] = moveChange.map((val, i) => (knot[i] + val) | 0) as coord;
          return [...(rope[i] as coord)];
        },
        [...headPosition] as coord,
      );
      tailPositions.unshift(newTail);
    }
  });

  return new Set(tailPositions.map((pos) => pos.join(','))).size;
};

// Part 1 is a simple 2 piece rope
console.log('Part 1:', simulateRopes(moves));
// Part 2 is a more complicated 10 piece rope
console.log('Part 2:', simulateRopes(moves, 10));

type coord = [number, number];

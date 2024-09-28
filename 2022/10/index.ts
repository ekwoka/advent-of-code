/**
 * --- Day 10: Cathode-Ray Tube ---
 * Part 1: 00:35:19   7218
 * Part 2: 00:44:52   4470
 * This challenge involves parsing a list of instructions for a small display, and then either calculating the signal strength or painting the display.
 */

import { readFile } from 'node:fs/promises';

const input: string = await readFile('input.txt', 'utf8');

const instructions = input.trim().split('\n').filter(Boolean);

// Steps through the instructions, with noops taking one cycle, and addx adding or substracting the x value after 2 cycles.
// This is genarlized by accepting a stepCallback that runs on every clock cycle
const processInstructions = (
  instructions: string[],
  stepCallback: (cycle: number, x: number) => void,
) => {
  const ctx = {
    cycle: 1,
    x: 1,
  };
  instructions.reduce((ctx, instruction) => {
    const [step, change] = instruction.split(' ');
    stepCallback(ctx.cycle, ctx.x);
    if (step === 'noop') {
      ctx.cycle++;
    } else {
      ctx.cycle++;
      stepCallback(ctx.cycle, ctx.x);
      ctx.x += Number(change);
      ctx.cycle++;
    }
    return ctx;
  }, ctx);
};

// Part One consists of multiplying the cycle by the x value at certain clock cycles, and then summing the results
const calculateSignalStrength = (instructions: string[]) => {
  let strength = 0;
  const stepCallback = (cycle: number, x: number) => {
    if ((cycle - 20) % 40) return;
    strength += cycle * x;
  };
  processInstructions(instructions, stepCallback);
  return strength;
};

// Part 2 consists of the x value representing a 3 pixel sprite, and the cycle representing which pixel of the display is being painted. When these overlap, the pixel is painted.
const paintToDisplay = (instructions: string[]) => {
  const screen = Array.from({ length: 6 }, () =>
    Array.from({ length: 40 }, () => ' '),
  );
  const stepCallback = (cycle: number, x: number) => {
    const row = (cycle / 40) | 0;
    const col = cycle % 40;
    if ([-1, 0, 1].includes(x + 1 - col)) screen[row][col] = '#';
  };
  processInstructions(instructions, stepCallback);
  return screen.map((row) => row.join('')).join('\n');
};

console.log('Part One:', calculateSignalStrength(instructions));

// To get the answer to Part 2, you need to log the display and visually read the results
console.log('Part Two:', '\n', paintToDisplay(instructions));

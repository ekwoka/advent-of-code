import '@ekwoka/rust-ts/prelude';
import type { AOCInput } from '../../utils';

interface Instruction {
  run(registers: Int32Array): number;
}

const registerIndex = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
};
class Copy implements Instruction {
  constructor(
    private source: string | number,
    private target: string | number,
  ) {}
  run(registers: Int32Array): number {
    registers[registerIndex[this.target as keyof typeof registerIndex]] =
      typeof this.source === 'string'
        ? registers[registerIndex[this.source as keyof typeof registerIndex]]
        : this.source;
    return 1;
  }
}

class Inc implements Instruction {
  private target: number;
  constructor(target: string) {
    this.target = registerIndex[target as keyof typeof registerIndex];
  }
  run(registers: Int32Array): number {
    registers[this.target]++;
    return 1;
  }
}

class Dec implements Instruction {
  private target: number;
  constructor(target: string) {
    this.target = registerIndex[target as keyof typeof registerIndex];
  }
  run(registers: Int32Array): number {
    registers[this.target]--;
    return 1;
  }
}

class Jnz implements Instruction {
  private value: number;
  constructor(
    private check: string | number,
    value: string | number,
  ) {
    this.value = typeof value === 'string' ? 0 : value;
  }
  run(registers: Int32Array): number {
    return (typeof this.check === 'string'
      ? registers[registerIndex[this.check as keyof typeof registerIndex]]
      : this.check) !== 0
      ? this.value
      : 1;
  }
}

export const partOne = (input: AOCInput) => {
  const registers = new Float64Array(4);
  const instructions = input
    .lines()
    .map((line) => {
      const [op, ...args] = line.split(' ');
      switch (op) {
        case 'cpy':
          return new Copy(
            Number(args[0]) || args[0],
            Number(args[1]) || args[1],
          );
        case 'inc':
          return new Inc(args[0]);
        case 'dec':
          return new Dec(args[0]);
        case 'jnz':
          return new Jnz(
            Number(args[0]) || args[0],
            Number(args[1]) || args[1],
          );
        default:
          throw new Error('Invalid instruction');
      }
    })
    .collect();
  let instruction = 0;
  while (instruction < instructions.length) {
    instruction += instructions[instruction].run(registers);
  }
  return registers[0];
};
export const partTwo = (input: AOCInput) => {
  const registers = new Float64Array(4);
  registers[2] = 1;
  const instructions = input
    .lines()
    .map((line) => {
      const [op, ...args] = line.split(' ');
      switch (op) {
        case 'cpy':
          return new Copy(
            Number(args[0]) || args[0],
            Number(args[1]) || args[1],
          );
        case 'inc':
          return new Inc(args[0]);
        case 'dec':
          return new Dec(args[0]);
        case 'jnz':
          return new Jnz(
            Number(args[0]) || args[0],
            Number(args[1]) || args[1],
          );
        default:
          throw new Error('Invalid instruction');
      }
    })
    .collect();
  let instruction = 0;
  while (instruction < instructions.length) {
    instruction += instructions[instruction].run(registers);
  }
  return registers[0];
};

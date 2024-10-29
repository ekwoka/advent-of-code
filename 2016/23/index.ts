import '@ekwoka/rust-ts/prelude';
import { AOCInput } from '../../utils';

interface Instruction {
  run(registers: Float64Array, instructions: Instruction[]): number;
  toggle(): Instruction;
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
  run(registers: Float64Array): number {
    if (typeof this.target !== 'string') return 1;
    registers[registerIndex[this.target as keyof typeof registerIndex]] =
      typeof this.source === 'string'
        ? registers[registerIndex[this.source as keyof typeof registerIndex]]
        : this.source;
    return 1;
  }
  toggle() {
    return new Jnz(this.source, this.target);
  }
}

class Jnz implements Instruction {
  constructor(
    private check: string | number,
    private value: string | number,
  ) {}
  run(registers: Float64Array): number {
    return (typeof this.check === 'string'
      ? registers[registerIndex[this.check as keyof typeof registerIndex]]
      : this.check) !== 0
      ? typeof this.value === 'string'
        ? registers[registerIndex[this.value as keyof typeof registerIndex]]
        : this.value
      : 1;
  }
  toggle() {
    return new Copy(this.check, this.value);
  }
}

class Inc implements Instruction {
  private target: number;
  constructor(target: string | number) {
    this.target =
      typeof target === 'string'
        ? registerIndex[target as keyof typeof registerIndex]
        : target;
  }
  run(registers: Float64Array): number {
    registers[this.target]++;
    return 1;
  }
  toggle() {
    return new Dec(this.target);
  }
}

class Dec implements Instruction {
  private target: number;
  constructor(target: string | number) {
    this.target =
      typeof target === 'string'
        ? registerIndex[target as keyof typeof registerIndex]
        : target;
  }
  run(registers: Float64Array): number {
    registers[this.target]--;
    return 1;
  }
  toggle() {
    return new Inc(this.target);
  }
}

class Tgl implements Instruction {
  constructor(private target: string | number) {}
  run(registers: Float64Array, instructions: Instruction[]) {
    const offset =
      typeof this.target === 'string'
        ? registers[registerIndex[this.target as keyof typeof registerIndex]]
        : this.target;
    const current = instructions.indexOf(this);
    if (current + offset >= instructions.length) return 1;
    instructions[current + offset] = instructions[current + offset].toggle();
    return 1;
  }
  toggle() {
    return new Inc(this.target);
  }
}
export const partOne = (input: string) => {
  const registers = new Float64Array(4);
  registers[0] = 7;
  const instructions = new AOCInput(input)
    .lines()
    .map((line) => {
      const [op, ...args] = line.split(' ');
      switch (op) {
        case 'cpy':
          return new Copy(
            Number.isNaN(Number(args[0])) ? args[0] : Number(args[0]),
            Number.isNaN(Number(args[1])) ? args[1] : Number(args[1]),
          );
        case 'inc':
          return new Inc(args[0]);
        case 'dec':
          return new Dec(args[0]);
        case 'jnz':
          return new Jnz(
            Number.isNaN(Number(args[0])) ? args[0] : Number(args[0]),
            Number.isNaN(Number(args[1])) ? args[1] : Number(args[1]),
          );
        case 'tgl':
          return new Tgl(
            Number.isNaN(Number(args[0])) ? args[0] : Number(args[0]),
          );
        default:
          throw new Error('Invalid instruction');
      }
    })
    .collect();
  let instruction = 0;
  while (instruction < instructions.length) {
    instruction += instructions[instruction].run(registers, instructions);
  }
  return registers[0];
};
export const partTwo = (input: string) => {
  const registers = new Float64Array(4);
  registers[0] = 12;
  const instructions = new AOCInput(input)
    .lines()
    .map((line) => {
      const [op, ...args] = line.split(' ');
      switch (op) {
        case 'cpy':
          return new Copy(
            Number.isNaN(Number(args[0])) ? args[0] : Number(args[0]),
            Number.isNaN(Number(args[1])) ? args[1] : Number(args[1]),
          );
        case 'inc':
          return new Inc(args[0]);
        case 'dec':
          return new Dec(args[0]);
        case 'jnz':
          return new Jnz(
            Number.isNaN(Number(args[0])) ? args[0] : Number(args[0]),
            Number.isNaN(Number(args[1])) ? args[1] : Number(args[1]),
          );
        case 'tgl':
          return new Tgl(
            Number.isNaN(Number(args[0])) ? args[0] : Number(args[0]),
          );
        default:
          throw new Error('Invalid instruction');
      }
    })
    .collect();
  let instruction = 0;
  while (instruction < instructions.length) {
    instruction += instructions[instruction].run(registers, instructions);
  }
  return registers[0];
};

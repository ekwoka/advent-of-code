import type { AOCInput } from '../../utils';

enum Instruction {
  And = 'AND',
  Or = 'OR',
  LShift = 'LSHIFT',
  RShift = 'RSHIFT',
  Not = 'NOT',
  Assign = 'ASSIGN',
}

interface Gate {
  cache: number | null;
  get(gates: Map<string, Gate>): number;
}

class And implements Gate {
  constructor(
    private LHS: string,
    private RHS: string,
  ) {}
  cache: number | null = null;
  get(gates: Map<string, Gate>) {
    if (this.cache === null)
      this.cache =
        gateIDtoNumber(this.LHS, gates) & gateIDtoNumber(this.RHS, gates);
    return this.cache;
  }
}

class Or implements Gate {
  constructor(
    private LHS: string,
    private RHS: string,
  ) {}
  cache: number | null = null;
  get(gates: Map<string, Gate>) {
    if (this.cache === null)
      this.cache =
        gateIDtoNumber(this.LHS, gates) | gateIDtoNumber(this.RHS, gates);
    return this.cache;
  }
}

class LShift implements Gate {
  constructor(
    private LHS: string,
    private RHS: number,
  ) {}
  cache: number | null = null;
  get(gates: Map<string, Gate>) {
    if (this.cache === null)
      this.cache = gateIDtoNumber(this.LHS, gates) << this.RHS;
    return this.cache;
  }
}

class RShift implements Gate {
  constructor(
    private LHS: string,
    private RHS: number,
  ) {}
  cache: number | null = null;
  get(gates: Map<string, Gate>) {
    if (this.cache === null)
      this.cache = gateIDtoNumber(this.LHS, gates) >> this.RHS;
    return this.cache;
  }
}

class Not implements Gate {
  constructor(private target: string) {}
  cache: number | null = null;
  get(gates: Map<string, Gate>) {
    if (this.cache === null)
      this.cache = Number.parseInt(
        gateIDtoNumber(this.target, gates)
          .toString(2)
          .padStart(16, '0')
          .split('')
          .map((bit) => (bit === '1' ? '0' : '1'))
          .join(''),
        2,
      );
    return this.cache;
  }
}

class Assign implements Gate {
  constructor(private constant: string) {}
  cache: number | null = null;
  set(newValue: string) {
    this.constant = newValue;
  }
  get(gates: Map<string, Gate>) {
    return gateIDtoNumber(this.constant, gates);
  }
}

const gateFromInstruction = (instruction: string) => {
  const steps = instruction.split(' ');
  switch (steps.length) {
    case 1:
      return new Assign(steps[0]);
    case 2:
      return new Not(steps[1]);
    case 3:
      switch (steps[1]) {
        case Instruction.And:
          return new And(steps[0], steps[2]);
        case Instruction.Or:
          return new Or(steps[0], steps[2]);
        case Instruction.LShift:
          return new LShift(steps[0], Number(steps[2]));
        case Instruction.RShift:
          return new RShift(steps[0], Number(steps[2]));
      }
  }
};

const gateIDtoNumber = (id: string, gates: Map<string, Gate>): number =>
  /\d+/.test(id) ? Number(id) : gates.get(id).get(gates);

export const partOne = (input: AOCInput, output = 'a'): number => {
  const gates = input
    .lines()
    .filter(Boolean)
    .map(String)
    .map((line) => {
      const [instruction, name] = line.split(' -> ');
      return [name, gateFromInstruction(instruction)] as const;
    })
    .fold(
      (gates, gate) => (gates.set(...gate), gates),
      new Map<string, Gate>(),
    );
  return gates.get(output).get(gates);
};

export const partTwo = (input: AOCInput): number => {
  const gates = input
    .lines()
    .filter(Boolean)
    .map(String)
    .map((line) => {
      const [instruction, name] = line.split(' -> ');
      return [name, gateFromInstruction(instruction)] as const;
    })
    .fold(
      (gates, gate) => (gates.set(...gate), gates),
      new Map<string, Gate>(),
    );
  (gates.get('b') as Assign).set(gates.get('a').get(gates).toString());
  gates.forEach((gate) => (gate.cache = null));
  return gates.get('a').get(gates);
};

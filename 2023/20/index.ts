import { AOCInput } from '../../utils';

/**
 * --- Day 20: ??? ---
 */
export const partOne = (input: AOCInput): number => {
  const queue: (() => void)[] = [];
  const counters: PulseCounter = {
    low: 0,
    high: 0,
    presses: 0,
    trigger(...cb) {
      queue.push(...cb);
    },
    done: false,
  };
  const modules = input
    .lines()
    .map((line) => {
      const [current, outputs] = line.split(' -> ');
      const node = makeNode(current, counters);
      return [node, outputs.split(', ')] as const;
    })
    .fold(
      (modules, [node, outputs]) => modules.set(node.name, [node, outputs]),
      new Map<string, [PulseModule, string[]]>(),
    );
  modules.forEach((mod) => {
    mod[1].forEach((output) =>
      mod[0].registerOutput(
        modules.get(output)?.[0] ?? new PulseModule(output, counters),
      ),
    );
  });
  const broadcaster = modules.get('broadcaster')![0];
  for (let i = 0; i < 1000; i++) {
    counters.presses++;
    broadcaster.lowPulse();
    while (queue.length) queue.shift()?.();
  }
  return counters.high * counters.low;
};

const makeNode = (name: string, state: PulseCounter) => {
  if (name === 'broadcaster') return new Broadcaster(state);
  const [type, ...chars] = name;
  if (type === '&') return new Conjunction(chars.join(''), state);
  if (type === '%') return new FlipFlop(chars.join(''), state);
};

export const partTwo = (input: AOCInput): number => {
  const queue: (() => void)[] = [];
  const counters: PulseCounter = {
    low: 0,
    high: 0,
    presses: 0,
    trigger(...cb) {
      queue.push(...cb);
    },
    done: false,
  };
  const modules = input
    .lines()
    .map((line) => {
      const [current, outputs] = line.split(' -> ');
      const node = makeNode(current, counters);
      return [node, outputs.split(', ')] as const;
    })
    .fold(
      (modules, [node, outputs]) => modules.set(node.name, [node, outputs]),
      new Map<string, [PulseModule, string[]]>(),
    );
  const rx = new RX('RX', counters);
  modules.forEach((mod) => {
    mod[1].forEach((output) =>
      mod[0].registerOutput(modules.get(output)?.[0] ?? rx),
    );
  });
  const broadcaster = modules.get('broadcaster')![0];

  const nodes = rx.inputs
    .toIter()
    .map((input) => input.inputs)
    .flat()
    .map((node) => {
      const done = { value: 0 };
      const watcher = new Watcher(counters, (count) => (done.value = count));
      node.registerOutput(watcher);
      return done;
    })
    .collect();
  while (nodes.some(({ value }) => value === 0)) {
    counters.presses++;
    broadcaster.lowPulse();
    while (queue.length) queue.shift()?.();
  }
  return nodes
    .toIter()
    .map(({ value }) => value)
    .reduce(lowestCommonMultiple);
};

enum ModuleType {
  Broadcaster,
  Conjunction,
  FlipFlop,
}

class PulseModule {
  type: ModuleType;
  output: PulseModule[] = [];
  inputs: PulseModule[] = [];
  constructor(
    public name: string,
    public state: PulseCounter,
  ) {}
  registerInput(input: PulseModule): PulseModule {
    this.inputs.push(input);
    return this;
  }
  registerOutput(output: PulseModule): PulseModule {
    this.output.push(output);
    output.registerInput(this);
    return this;
  }
  lowPulse(_sender?: PulseModule): PulseModule {
    this.state.low++;
    return this;
  }
  highPulse(_sender?: PulseModule): PulseModule {
    this.state.high++;
    return this;
  }
}

class Broadcaster extends PulseModule {
  type = ModuleType.Broadcaster;
  constructor(state: PulseCounter) {
    super('broadcaster', state);
  }
  lowPulse(): PulseModule {
    this.state.low++;
    this.state.trigger(
      ...this.output.map((output) => () => output.lowPulse(this)),
    );
    return this;
  }
  highPulse(): PulseModule {
    this.state.high++;
    this.state.trigger(
      ...this.output.map((output) => () => output.highPulse(this)),
    );
    return this;
  }
}

class FlipFlop extends PulseModule {
  type = ModuleType.FlipFlop;
  on = false;
  constructor(name: string, state: PulseCounter) {
    super(name, state);
  }
  lowPulse(): PulseModule {
    this.state.low++;
    this.on = !this.on;
    if (this.on)
      this.state.trigger(
        ...this.output.map((output) => () => output.highPulse(this)),
      );
    else
      this.state.trigger(
        ...this.output.map((output) => () => output.lowPulse(this)),
      );

    return this;
  }
}

class Conjunction extends PulseModule {
  type = ModuleType.Conjunction;
  inputHistory: Map<PulseModule, boolean> = new Map();
  constructor(name: string, state: PulseCounter) {
    super(name, state);
  }
  registerInput(input: PulseModule): PulseModule {
    this.inputs.push(input);
    this.inputHistory.set(input, false);
    return this;
  }
  lowPulse(sender: PulseModule): PulseModule {
    this.state.low++;
    this.inputHistory.set(sender, false);
    this.state.trigger(
      ...this.output.map((output) => () => output.highPulse(this)),
    );
    return this;
  }
  highPulse(sender: PulseModule): PulseModule {
    this.state.high++;
    this.inputHistory.set(sender, true);
    if (Array.from(this.inputHistory.values()).every((value) => value))
      this.state.trigger(
        ...this.output.map((output) => () => output.lowPulse(this)),
      );
    else
      this.state.trigger(
        ...this.output.map((output) => () => output.highPulse(this)),
      );
    return this;
  }
}

class Watcher extends PulseModule {
  constructor(
    state: PulseCounter,
    public cb: () => void,
  ) {
    super('watcher', state);
  }
  lowPulse(): PulseModule {
    return this;
  }
  highPulse(): PulseModule {
    this.cb(this.state.presses);
    return this;
  }
}

type PulseCounter = {
  low: number;
  high: number;
  presses: number;
  trigger(...cb: (() => void)[]): void;
  done: boolean;
};

class RX extends PulseModule {
  constructor(name: string, state: PulseCounter) {
    super(name, state);
  }
  lowPulse(): PulseModule {
    this.state.low++;
    this.state.done = true;
    return this;
  }
}

const lowestCommonMultiple = (lcm: number, step: number): number =>
  (lcm * step) / greatestCommonDivisor(lcm, step);
const greatestCommonDivisor = (a: number, b: number): number => {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
};

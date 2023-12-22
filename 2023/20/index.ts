import { AOCInput } from '../../utils';

/**
 * --- Day 20: ??? ---
 */
export const partOne = (input: AOCInput): number => {
  const modules = input.lines().map((line) => {
    const [current, outputs] = line.split(' -> ');
    return [current, outputs.split(', ')] as const;
  });
  return modules.count();
};

export const partTwo = (_input: AOCInput): number => {
  return 0;
};

interface PulseModule {
  type: ModuleType;
  output: PulseModule[];
  registerInput(input: PulseModule): PulseModule;
  registerOutput(output: PulseModule): PulseModule;
  lowPulse(): PulseModule;
  highPulse(): PulseModule;
}

class _Broadcaster implements PulseModule {
  type = ModuleType.Broadcaster;
  output: PulseModule[] = [];
  registerInput(): PulseModule {
    return this;
  }
  registerOutput(output: PulseModule): PulseModule {
    this.output.push(output);
    return this;
  }
  lowPulse(): PulseModule {
    return this;
  }
  highPulse(): PulseModule {
    return this;
  }
}

enum ModuleType {
  Broadcaster,
  Conjunction,
  FlipFlop,
}

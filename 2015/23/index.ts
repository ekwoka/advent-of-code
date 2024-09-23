import type { AOCInput } from '../../utils';

enum Instruction {
  Half = 'hlf',
  Triple = 'tpl',
  Inc = 'inc',
  Jump = 'jmp',
  JumpEven = 'jie',
  JumpOne = 'jio',
}
export const partOne = (input: AOCInput, a = 0, b = 0) => {
  const registry = {
    a,
    b,
  };
  let position = 0;
  const lines = input
    .lines()
    .filter(Boolean)
    .map((line) => line.split(/,? /))
    .collect();
  while (position < lines.length) {
    const [instruction, ...args] = lines[position];
    if (instruction === Instruction.Half) registry[args[0]] /= 2;
    if (instruction === Instruction.Triple) registry[args[0]] *= 3;
    if (instruction === Instruction.Inc) registry[args[0]]++;
    if (instruction === Instruction.Jump) {
      position += Number(args[0]);
      continue;
    }
    if (instruction === Instruction.JumpEven)
      if (!(registry[args[0]] & 1)) {
        position += Number(args[1]);
        continue;
      }
    if (instruction === Instruction.JumpOne)
      if (registry[args[0]] === 1) {
        position += Number(args[1]);
        continue;
      }
    position++;
  }
  return registry.b;
};

import '../../utils/prelude';
import type { AOCInput } from '../../utils';

class Replacement {
  get delta() {
    return this.to.length - this.from.length;
  }
  constructor(
    public from: string,
    public to: string,
  ) {}
  public replace(molecule: string) {
    return molecule
      .matchAll(new RegExp(this.from, 'g'))
      .iter()
      .map(
        ({ index }) =>
          molecule.slice(0, index) +
          this.to +
          molecule.slice(index + this.from.length),
      );
  }
  public reverse(molecule: string) {
    return molecule
      .matchAll(new RegExp(this.to, 'g'))
      .iter()
      .map(
        ({ index }) =>
          molecule.slice(0, index) +
          this.from +
          molecule.slice(index + this.to.length),
      );
  }
  static From(str: AOCInput) {
    const [_, from, to] = str.match(/(\w+) => (\w+)/);
    return new Replacement(from, to);
  }
}
export const partOne = (input: AOCInput) => {
  const molecule = input.lines().filter(Boolean).last().valueOf();
  const distinctMolecules = input
    .lines()
    .filter(Boolean)
    .filter((line) => line.includes('=>'))
    .map(Replacement.From)
    .flatMap((replacement) => replacement.replace(molecule))
    .fold((set, molecule) => (set.add(molecule), set), new Set<string>());
  return distinctMolecules.size;
};
export const partTwo = (input: AOCInput) => {
  const molecule = input.lines().filter(Boolean).last().valueOf();
  const replacements = input
    .lines()
    .filter(Boolean)
    .filter((line) => line.includes('=>'))
    .map(Replacement.From)
    .sort((a, b) => a.delta - b.delta)
    .collect();
  const queue: [molecule: string, replacements: number][] = [[molecule, 0]];
  while (queue.length) {
    const [mol, count] = queue.pop();
    if (mol === 'e') return count;
    replacements
      .iter()
      .flatMap((change) =>
        change.reverse(mol).map((mol) => [mol, count + 1] as const),
      )
      .forEach(queue.push.bind(queue));
  }
};

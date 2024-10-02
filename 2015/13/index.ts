import '../../utils/prelude';
import { range } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';

export const partOne = (input: AOCInput) => {
  const relations = input
    .lines()
    .filter(Boolean)
    .map((line) => line.match(/(\w+) would (gain|lose) (\d+).* (\w+)\.$/))
    .map(
      ([_, first, direction, value, second]) =>
        [
          first,
          second,
          Number(value) * (direction === 'gain' ? 1 : -1),
        ] as const,
    )
    .fold(
      (relation, [first, second, change]) => {
        (relation[first] ??= {})[second] =
          change + (relation[first][second] ?? 0);
        (relation[second] ??= {})[first] =
          change + (relation[second][first] ?? 0);
        return relation;
      },
      {} as Record<string, Record<string, number>>,
    );
  const wholeTable = Object.keys(relations);
  let iter: RustIterator<string[]> = wholeTable.iter().map((name) => [name]);
  range(1, wholeTable.length - 1).forEach(() => {
    iter = iter.flatMap((names) =>
      wholeTable
        .iter()
        .filter((name) => !names.includes(name))
        .map((name) => [...names, name]),
    );
  });
  return iter
    .map((names) =>
      names
        .iter()
        .chain([names[0]])
        .window(2)
        .map(([a, b]) => relations[a][b])
        .sum(),
    )
    .max();
};
export const partTwo = (input: AOCInput) => {
  const relations = input
    .lines()
    .filter(Boolean)
    .map((line) => line.match(/(\w+) would (gain|lose) (\d+).* (\w+)\.$/))
    .map(
      ([_, first, direction, value, second]) =>
        [
          first,
          second,
          Number(value) * (direction === 'gain' ? 1 : -1),
        ] as const,
    )
    .fold(
      (relation, [first, second, change]) => {
        (relation[first] ??= {})[second] =
          change + (relation[first][second] ?? 0);
        (relation[second] ??= {})[first] =
          change + (relation[second][first] ?? 0);
        return relation;
      },
      {} as Record<string, Record<string, number>>,
    );
  Object.keys(relations).forEach((name) => (relations[name].you = 0));
  relations.you = Object.fromEntries(
    Object.keys(relations).map((name) => [name, 0]),
  );
  const wholeTable = Object.keys(relations);
  let iter: RustIterator<string[]> = wholeTable.iter().map((name) => [name]);
  range(1, wholeTable.length - 1).forEach(() => {
    iter = iter.flatMap((names) =>
      wholeTable
        .iter()
        .filter((name) => !names.includes(name))
        .map((name) => [...names, name]),
    );
  });
  return iter
    .map((names) =>
      names
        .iter()
        .chain([names[0]])
        .window(2)
        .map(([a, b]) => relations[a][b])
        .sum(),
    )
    .max();
};

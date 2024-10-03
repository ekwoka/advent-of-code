import '@ekwoka/rust-ts/prelude';
import { type RustIterator, range } from '@ekwoka/rust-ts';
import { AOCInput } from '../../utils';

/**
 * --- Day 13: Point of Incidence ---
 */
export const partOne = (input: AOCInput): number => {
  return input
    .split('\n\n')
    .iter()
    .map((mirror) => new AOCInput(mirror))
    .map(toRowsAndColumns)
    .map(
      ([rows, cols]) =>
        range(1, rows.length - 1)
          .map((i) => [i, rows] as const)
          .chain(range(1, cols.length - 1).map((i) => [i, cols]))
          .filter(([i, group]) =>
            hasExactlyNChanges(0)(splitZipAt<string>(i, group)),
          )
          .map(([i, group]) => (group === rows ? i * 100 : i))
          .nth(0)!,
    )
    .sum();
};

export const partTwo = (input: AOCInput): number => {
  return input
    .split('\n\n')
    .iter()
    .map((mirror) => new AOCInput(mirror))
    .map(toRowsAndColumns)
    .map(
      ([rows, cols]) =>
        range(1, rows.length - 1)
          .map((i) => [i, rows] as const)
          .chain(range(1, cols.length - 1).map((i) => [i, cols]))
          .filter(([i, group]) =>
            hasExactlyNChanges(1)(
              splitZipAt<string>(i, group).flatMap(zip<string>),
            ),
          )
          .map(([i, group]) => (group === rows ? i * 100 : i))
          .nth(0)!,
    )
    .sum();
};

const splitZipAt = <T>(
  position: number,
  list: Array<T>,
): RustIterator<[T, T]> => {
  const iter = list.iter();
  return iter.take(position).reverse().zip<T>(iter);
};

const zip = <T extends Array<string> | string>([a, b]: [T, T]): RustIterator<
  [string, string]
> => a.iter().zip<string>(b);

const different = <T>([a, b]: [T, T]): boolean => a !== b;

const toInlineIndex = (acc: [number]) => ++acc[0];

const hasExactlyNChanges =
  (n: number) => (iter: RustIterator<[string, string]>) => {
    const changes = iter
      .filter(different)
      .scan(toInlineIndex, 0)
      .take(n + 1)
      .collect();
    return n === changes.length;
  };

const toRowsAndColumns = (chunk: AOCInput): [string[], string[]] => {
  const rows: string[][] = [];
  const cols: string[][] = [];
  let y = 0;
  for (const ch of chunk.chars())
    if (ch === '\n') {
      y++;
    } else (cols[(rows[y] ??= []).push(ch) - 1] ??= []).push(ch);

  return [
    rows.map((line) => line.join('')),
    cols.map((line) => line.join('')),
  ] as const;
};

import { RustIterator, range } from '@ekwoka/rust-ts';
import { AOCInput } from '../../utils';

/**
 * --- Day 13: Point of Incidence ---
 */
export const partOne = (input: AOCInput): number => {
  return input
    .split('\n\n')
    .toIter()
    .map((mirror) => new AOCInput(mirror))
    .map(toRowsAndColumns)
    .map(([rows, cols]) =>
      range(1, rows.length - 1)
        .map((i) => [i, rows] as const)
        .chain(range(1, cols.length - 1).map((i) => [i, cols]))
        .filter(([i, group]) =>
          hasExactlyNChanges(0)(splitZipAt<string>(i, group)),
        )
        .map(([i, group]) => (group === rows ? i * 100 : i))
        .nth(0),
    )
    .sum();
};

export const partTwo = (input: AOCInput): number => {
  return input
    .split('\n\n')
    .toIter()
    .map((mirror) => new AOCInput(mirror))
    .map(toRowsAndColumns)
    .map(([rows, cols]) =>
      range(1, rows.length - 1)
        .map((i) => [i, rows] as const)
        .chain(range(1, cols.length - 1).map((i) => [i, cols]))
        .filter(([i, group]) =>
          hasExactlyNChanges(1)(
            splitZipAt<string>(i, group).flatMap<
              RustIterator<[string, string]>
            >(zip<string>),
          ),
        )
        .map(([i, group]) => (group === rows ? i * 100 : i))
        .nth(0),
    )
    .sum();
};

const splitZipAt = <T>(
  position: number,
  list: Iterable<T>,
): RustIterator<[T, T]> => {
  const iter = new RustIterator(list);
  return iter.take(position).reverse().zip<T>(iter) as RustIterator<[T, T]>;
};

const zip = <T>([a, b]: [Iterable<T>, Iterable<T>]): RustIterator<[T, T]> =>
  new RustIterator(a).zip<T>(new RustIterator(b)) as RustIterator<[T, T]>;

const different = <T>([a, b]: [T, T]): boolean => a !== b;

const toInlineIndex = (acc: [number]) => ++acc[0];

const hasExactlyNChanges =
  (n: number) => (iter: RustIterator<[string, string]>) => {
    const changes = iter
      .filter(different)
      .scan(toInlineIndex, 0)
      .take(n + 1)
      .collect();
    return (n === 0 || changes.at(-2)) && !changes.at(-1);
  };

const toRowsAndColumns = (chunk: AOCInput): [string[], string[]] => {
  const rows: string[][] = [];
  const cols: string[][] = [];
  let y = 0;
  for (const ch of chunk.chars())
    if (ch === '\n') {
      y++;
      continue;
    } else (cols[(rows[y] ??= []).push(ch) - 1] ??= []).push(ch);

  return [
    rows.map((line) => line.join('')),
    cols.map((line) => line.join('')),
  ] as const;
};

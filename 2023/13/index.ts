import { RustIterator, range } from '@ekwoka/rust-ts';
import { AOCInput } from '../../utils';

/**
 * --- Day 13: Point of Incidence ---
 */
export const partOne = (input: AOCInput): number => {
  const mirrors = input
    .split('\n\n')
    .toIter()
    .map((mirror) => new AOCInput(mirror))
    .map((mirror) => {
      const rows = mirror
        .lines()
        .map((line) => line.chars().sum())
        .collect();

      for (const idx of rows
        .toIter()
        .window(2)
        .enumerate()
        .filter(([_, [a, b]]) => a === b)
        .map(([i, _]) => i + 1)) {
        const before = rows.slice(0, idx);
        const after = rows.slice(idx);
        if (
          before
            .toIter()
            .reverse()
            .zip(after)
            .all(([a, b]) => a === b)
        )
          return [100, idx];
      }

      const cols = range(0, rows[0].length - 1)
        .map((y) =>
          range(0, rows.length - 1)
            .map((x) => rows[x][y])
            .sum(),
        )
        .collect();
      for (const idx of cols
        .toIter()
        .window(2)
        .enumerate()
        .filter(([_, [a, b]]) => a === b)
        .map(([i, _]) => i + 1)) {
        const before = cols.slice(0, idx);
        const after = cols.slice(idx);
        if (
          before
            .toIter()
            .reverse()
            .zip(after)
            .all(([a, b]) => a === b)
        )
          return [1, idx];
      }

      return [0, 0];
    })
    .map(([type, mid]) => mid * type)
    .sum();

  return mirrors;
};

export const partTwo = (input: AOCInput): number => {
  const mirrors = input
    .split('\n\n')
    .toIter()
    .inspect(console.log)
    .map((mirror) => new AOCInput(mirror))
    .map((mirror) => {
      const rows = mirror
        .lines()
        .map((line) => line.chars().sum())
        .collect();
      const cols = range(0, rows[0].length - 1)
        .map((y) =>
          range(0, rows.length - 1)
            .map((x) => rows[x][y])
            .sum(),
        )
        .collect();
      return [rows, cols];
    })
    .map(([rows, cols]) => {
      const rReverse = rows.toIter().reverse().collect();
      const cReverse = cols.toIter().reverse().collect();
      const options = [
        [rows, rReverse],
        [cols, cReverse],
      ] as const;
      console.log(rows.length);
      return range(1, rows.length - 1)
        .chain(range(rows.length + 1, rows.length + cols.length - 1))
        .filter((i) => {
          if (i === rows.length) return false;
          const group = options[Number(i > rows.length)];
          i = i > rows.length ? i - rows.length : i;
          const changes = group[0]
            .slice(i)
            .toIter()
            .zip(group[1].slice(-i))
            .flatMap(([a, b]) => new RustIterator(a).zip(new RustIterator(b)))
            .filter(([a, b]) => a != b)
            .take(2)
            .collect();
          return changes[0] && !changes[1];
        })
        .inspect((idx) => {
          console.log(
            'Mirror Point at:',
            idx > rows.length ? 'Col' : 'Row',
            idx > rows.length ? idx - rows.length : idx,
          );
        })
        .inspect(console.log)
        .map((i) => (i > rows.length ? i - rows.length : i * 100))
        .nth(0);
    })
    .inspect(console.log)
    .sum();

  return mirrors;
};

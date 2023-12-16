import { AOCInput } from '../../utils';

const { min, max } = Math;

export const partOne = (input: AOCInput): number => {
  console.time('part 1');
  const lines = input
    .lines()
    .filter((line) => line.length > 0)
    .peekable();
  const numberRegexp = /^\d+$/;
  const seeds = lines
    .nth(0)
    .words()
    .filter((item) => numberRegexp.test(item as unknown as string))
    .map(Number);
  const min = lines

    .map((line) => {
      if (!line.includes('map')) console.error('what the heck happened?');
      const modifiers = [] as [number, number, number][];
      while (!lines.peek().done && !lines.peek().value?.includes('map')) {
        modifiers.push(
          (lines.next().value as AOCInput).words().map(Number).collect() as [
            number,
            number,
            number,
          ],
        );
      }
      return modifiers
        .toIter()
        .map(([target, start, range]) => [start, start + range, target - start])
        .collect() as [number, number, number][];
    })
    .fold(
      (seeds, modifiers) =>
        seeds.map(
          (seed) =>
            seed +
            (modifiers
              .toIter()
              .find(([start, end]) => seed >= start && seed <= end)?.[2] ?? 0),
        ),
      seeds,
    )
    .min();
  console.timeEnd('part 1');
  return min ?? 0;
};

export const partTwo = (input: AOCInput): number => {
  const lines = input
    .lines()
    .filter((line) => line.length > 0)
    .peekable();
  const numberRegexp = /^\d+$/;
  const seeds = lines
    .nth(0)
    .words()
    .filter((item) => numberRegexp.test(item as unknown as string))
    .map(Number)
    .arrayChunks(2)
    .map<[number, number]>(([start, range]) => [start, start + range]);
  const result = lines
    .map((line) => {
      if (!line.includes('map')) console.error('what the heck happened?');
      const modifiers = [] as [number, number, number][];
      while (!lines.peek().done && !lines.peek().value?.includes('map')) {
        modifiers.push(
          (lines.next().value as AOCInput).words().map(Number).collect() as [
            number,
            number,
            number,
          ],
        );
      }
      return modifiers
        .toIter()
        .map(([target, start, range]) => [start, start + range, target - start])
        .collect() as [number, number, number][];
    })
    .fold(
      (seeds, modifiers) =>
        seeds.flatMap((seed) =>
          modifiers
            .toIter()
            .filter(([start, end]) => start <= seed[1] && end >= seed[0])
            .map(
              ([start, end, offset]) =>
                [max(start, seed[0]) + offset, min(end, seed[1]) + offset] as [
                  number,
                  number,
                ],
            )
            .chain(
              modifiers
                .toIter()
                .filter(([start, end]) => start >= seed[0] || end <= seed[1])
                .flatMap(
                  ([start, end]) =>
                    [
                      [seed[0], min(seed[1], max(seed[0], start))],
                      [min(seed[1], max(seed[0], end)), seed[1]],
                    ] as [number, number][],
                ),
            )
            .filter(([start, end]) => start < end),
        ),
      seeds,
    )
    .map((seed) => seed[0])
    .min();
  return result;
};

import { AOCInput } from '../../utils';

/**
 * --- Day 12: Hot Springs ---
 */
export const partOne = (input: AOCInput): number => {
  return input
    .lines()
    .map((line) => line.words().collect() as [AOCInput, AOCInput])
    .map(
      ([springs, counts]) =>
        [
          springs.chars().collect(),
          counts.splitBy(',').map(Number).collect(),
        ] as const,
    )
    .map(([springs, groups]) => getPossibleCombos(springs, 0, groups))
    .sum();
};

export const partTwo = (input: AOCInput): number => {
  return input
    .lines()
    .map((line) => line.words().collect() as [AOCInput, AOCInput])
    .map(([springs, counts]) =>
      [Array(5).fill(springs).join('?'), Array(5).fill(counts).join(',')].map(
        (s) => new AOCInput(s),
      ),
    )
    .map(
      ([springs, counts]) =>
        [
          springs.chars().collect(),
          counts.splitBy(',').map(Number).collect(),
        ] as const,
    )
    .map(([springs, groups]) => getPossibleCombos(springs, 0, groups))
    .sum();
};

const cache = new Map<string, number>();
const getPossibleCombos = (
  initialSprings: string[],
  streak,
  groups: readonly number[],
  history = '',
): number => {
  const key = `${initialSprings.join('')}-${streak}-${groups.join(',')}`;

  if (cache.has(key)) {
    return cache.get(key);
  }
  const remainingGroups = groups.slice();
  const remainingSprings = initialSprings.toIter().peekable();

  let done = false;
  remainingSprings
    .takeWhile((ch) => ch !== '?' && !done)
    .forEach((next) => {
      if (done) return;
      if (next === '#') {
        if (!remainingGroups.length) return (done = true);
        if (streak === remainingGroups[0]) return (done = true);
        streak++;
      }
      if (next === '.')
        if (streak) {
          if (streak !== remainingGroups[0]) return (done = true);
          streak = 0;
          remainingGroups.shift();
        }
    });
  if (done) {
    cache.set(key, 0);
    return 0;
  }
  if (remainingSprings.peek().done) {
    if (
      remainingGroups.length === 0 ||
      (remainingGroups.length === 1 &&
        (streak === remainingGroups[0] ||
          (initialSprings.at(-1) === '?' && streak === remainingGroups[0] - 1)))
    ) {
      cache.set(key, 1);
      return 1;
    }
    cache.set(key, 0);
    return 0;
  }

  const rest = remainingSprings.collect();
  const historical = history + initialSprings.join('').split('?')[0];
  let count = 0;
  if (streak)
    if (streak !== remainingGroups[0])
      count += getPossibleCombos(
        rest,
        streak + 1,
        remainingGroups,
        `${historical}#`,
      );
    else
      count += getPossibleCombos(
        rest,
        0,
        remainingGroups.slice(1),
        `${historical}.`,
      );
  else if (!remainingGroups.length)
    count += getPossibleCombos(rest, 0, remainingGroups, `${historical}.`);
  else
    count +=
      getPossibleCombos(rest, 1, remainingGroups, `${historical}#`) +
      getPossibleCombos(rest, 0, remainingGroups, `${historical}.`);

  cache.set(key, count);
  return count;
};

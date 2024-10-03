import '@ekwoka/rust-ts/prelude';
import type { AOCInput } from '../../utils';

export const partOne = (input: AOCInput, groups = 3) => {
  const packages = input
    .lines()
    .filter(Boolean)
    .map(Number)
    .sort((a, b) => b - a)
    .collect();
  const targetWeight = packages.iter().sum() / groups;
  function* getCombos() {
    const queue: [idx: number, sum: number, product: number, count: number][] =
      packages.map((pkg, i) => [i, pkg, pkg, 1]);
    let minCount = Number.POSITIVE_INFINITY;
    while (queue.length) {
      const [idx, sum, product, count] = queue.shift()!;
      if (count > minCount) continue;
      if (sum === targetWeight) {
        yield product;
        minCount = Math.min(minCount, count);
        continue;
      }
      packages.slice(idx + 1).forEach((pkg, i) => {
        queue.push([idx + i + 1, sum + pkg, product * pkg, count + 1]);
      });
    }
  }
  return getCombos().iter().min();
};
export const partTwo = (input: AOCInput) => {
  return partOne(input, 4);
};

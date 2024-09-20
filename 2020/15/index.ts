import type { AOCInput } from '../../utils';

export const partOne = (input: AOCInput, turn = 2020) => {
  const lastSpoken = new Array(turn).fill(0);
  let i = input
    .splitBy(',')
    .filter(Boolean)
    .map(Number)
    .enumerate()
    .inspect(([turn, value]) => {
      lastSpoken[value] = turn + 1;
    })
    .count();
  let next = 0;
  while (++i < turn) {
    if (lastSpoken[next]) {
      const since = i - lastSpoken[next];
      lastSpoken[next] = i;
      next = since;
    } else {
      lastSpoken[next] = i;
      next = 0;
    }
  }
  return next;
};

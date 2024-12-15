import { AOCInput } from '../../utils';

export const partTwo = (input: string): number => {
  return new AOCInput(input)
    .lines()
    .filter((line) => line.length > 0)
    .map((line) =>
      line
        .split(':')[1]
        .split(' | ')
        .map((x) => x.trim().split(/\s+/)),
    )
    .map(
      ([winning, owned]) => winning.filter((id) => owned.includes(id)).length,
    )
    .scan((state, wins) => {
      state[0] = (state[0] ?? 0) + 1;
      for (let i = 1; i <= wins; i++) state[i] = (state[i] ?? 0) + state[0];
      return state;
    }, 0)
    .map((state) => state.shift() ?? 1)
    .sum();
};

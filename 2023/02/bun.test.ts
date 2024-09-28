import { getInput } from '../../utils';
import { part_one, part_two } from './main-day2.rs';

const toStr = (input: string) => new TextEncoder().encode(input);

describe('in Rust', async () => {
  const input = await getInput(2023, 2);
  it('Passes Part 1 Test', () => {
    expect(
      part_one(
        toStr(
          'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green\nGame 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue\nGame 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red\nGame 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red\nGame 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green',
        ),
      ),
    ).toBe(8);
  });
  it('Passes Part 2 Test', () => {
    expect(
      part_two(
        toStr(
          'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green\nGame 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue\nGame 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red\nGame 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red\nGame 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green',
        ),
      ),
    ).toBe(2286);
  });
  it('Passes Part 1', () => {
    expect(part_one(toStr(input.toString()))).toBe(2716);
  });
  it('Passes Part 2', () => {
    expect(part_two(toStr(input.toString()))).toBe(72227);
  });
});

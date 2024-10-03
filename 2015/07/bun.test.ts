import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 7', async () => {
  const input = await getInput(2015, 7);
  it.skip('Passes Part 1 Test', () => {
    expect(
      partOne(
        new AOCInput(
          `123 -> x
456 -> y
x AND y -> d
x OR y -> e
x LSHIFT 2 -> f
y RSHIFT 2 -> g
NOT x -> h
NOT y -> i`,
        ),
        'h',
      ),
    ).toBe(65412);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(16076);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(2797);
  });
});

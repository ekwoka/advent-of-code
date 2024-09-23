import { partOne } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 23', async () => {
  const input = await getInput(2015, 23);
  it('Passes Part 1 Test', () => {
    expect(
      partOne(
        new AOCInput(`inc b
jio b, +2
tpl b
inc a`),
      ),
    ).toBe(1);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(255);
  });
  it('Passes Part 2 Test', () => {
    expect(
      partOne(
        new AOCInput(`inc b
jio a, +2
tpl b
inc a`),
        1,
      ),
    ).toBe(1);
  });
  it('Passes Part 2', () => {
    expect(partOne(input, 1)).toBe(334);
  });
});

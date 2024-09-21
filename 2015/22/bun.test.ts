import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 22', async () => {
  const input = await getInput(2015, 22);
  it('Passes Part 1 Test', () => {
    expect(
      partOne(
        new AOCInput(`Hit Points: 13
Damage: 8`),
        10,
        250,
      ),
    ).toBe(226);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(1_269);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(1_309);
  });
});

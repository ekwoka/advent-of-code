import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 15', async () => {
  const input = await getInput(2015, 15);
  it.skip('Passes Part 1 Test', () => {
    expect(
      partOne(
        new AOCInput(`Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3`),
      ),
    ).toBe(62_842_880);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(21_367_368);
  });
  it.skip('Passes Part 2 Test', () => {
    expect(
      partTwo(
        new AOCInput(`Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3`),
      ),
    ).toBe(57_600_000);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(1_766_400);
  });
});

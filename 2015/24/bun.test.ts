import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 24', async () => {
  const input = await getInput(2015, 24);
  it.skip('Passes Part 1 Test', () => {
    expect(
      partOne(
        new AOCInput(`1
2
3
4
5
7
8
9
10
11`),
      ),
    ).toBe(99);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(11_846_773_891);
  });
  it.skip('Passes Part 2 Test', () => {
    expect(
      partTwo(
        new AOCInput(`1
2
3
4
5
7
8
9
10
11`),
      ),
    ).toBe(44);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(80_393_059);
  });
});

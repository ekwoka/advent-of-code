import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2016 Day 4', async () => {
  const input = await getInput(2016, 4);
  it('Passes Part 1 Test', () => {
    expect(
      partOne(
        new AOCInput(`aaaaa-bbb-z-y-x-123[abxyz]
a-b-c-d-e-f-g-h-987[abcde]
not-a-real-room-404[oarel]
totally-real-room-200[decoy]`),
      ),
    ).toBe(1514);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(245_102);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(324);
  });
});

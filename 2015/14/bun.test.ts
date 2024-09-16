import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 14', async () => {
  const input = await getInput(2015, 14);
  it('Passes Part 1 Test', () => {
    expect(
      partOne(
        new AOCInput(`Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.`),
        1000,
      ),
    ).toBe(1120);
  });
  it('Passes Part 1', () => {
    expect(partOne(input, 2503)).toBe(2696);
  });
  it('Passes Part 1 Test', () => {
    expect(
      partTwo(
        new AOCInput(`Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.`),
        1000,
      ),
    ).toBe(689);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input, 2503)).toBe(1084);
  });
});

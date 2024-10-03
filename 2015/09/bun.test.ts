import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 9', async () => {
  const input = await getInput(2015, 9);
  it.skip('Passes Part 1 Test', () => {
    expect(
      partOne(
        new AOCInput(`London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141`),
      ),
    ).toBe(605);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(207);
  });
  it.skip('Passes Part 2 Test', () => {
    expect(
      partTwo(
        new AOCInput(`London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141`),
      ),
    ).toBe(982);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(804);
  });
});

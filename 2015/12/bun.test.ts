import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 12', async () => {
  const input = await getInput(2015, 12);
  it.skip('Passes Part 1 Test', () => {
    expect(partOne(new AOCInput(`{"a":{"b":4},"c":-1}`))).toBe(
      partOne(new AOCInput('[[[3]]]')),
    );
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(119433);
  });
  it.skip('Passes Part 2 Test', () => {
    expect(partTwo(new AOCInput(`{"d":"red","e":[1,2,3,4],"f":5}`))).toBe(0);
    expect(partTwo(new AOCInput(`{"d":[1,"red",{"c":"red","b":2},3]}`))).toBe(
      4,
    );
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(68466);
  });
});

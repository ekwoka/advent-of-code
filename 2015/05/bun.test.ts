import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 5', async () => {
  const input = await getInput(2015, 5);
  it.skip('Passes Part 1 Test', () => {
    expect(
      partOne(
        new AOCInput(`ugknbfddgicrmopn
aaa
jchzalrnumimnmhp
haegwjzuvuyypxyu
dvszwmarrgswjxmb`),
      ),
    ).toBe(2);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(255);
  });
  it.skip('Passes Part 2 Test', () => {
    expect(partTwo(new AOCInput('qjhvhtzxzqqjkmpb\nuurcxstgmygtbstg'))).toBe(1);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(55);
  });
});

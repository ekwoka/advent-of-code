import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 03', async () => {
  const input = await getInput(2023, 3);
  const testInput = new AOCInput(
    '467..114..\n...*......\n..35..633.\n......#...\n617*......\n.....+.58.\n..592.....\n......755.\n...$.*....\n.664.598..',
  );
  it('Passes Part 1 Test', () => {
    expect(partOne(testInput)).toBe(4361);
  });
  it('Passes Part 2 Test', () => {
    expect(partTwo(testInput)).toBe(467835);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(557705);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(84266818);
  });
});

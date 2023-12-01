import { partOne, partOneStream, partTwo, partTwoStream } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2023 Day 1', async () => {
  const input = await getInput(2023, 1);
  it('Passes Part 1 Test', () => {
    expect(
      partOne(new AOCInput('1abc2\npqr3stu8vwx\na1b2c3d4e5f\ntreb7uchet')),
    ).toBe(142);
  });
  it('Passes Part 2 Test', () => {
    expect(
      partTwo(
        new AOCInput(
          'two1nine\neightwothree\nabcone2threexyz\nxtwone3four\n4nineeightseven2\nzoneight234\n7pqrstsixteen',
        ),
      ),
    ).toBe(281);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(55090);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(54845);
  });
});
describe('Character Stream', async () => {
  const input = await getInput(2023, 1);
  it('Passes Part 1 Test', () => {
    expect(
      partOneStream(
        new AOCInput('1abc2\npqr3stu8vwx\na1b2c3d4e5f\ntreb7uchet'),
      ),
    ).toBe(142);
  });
  it('Passes Part 2 Test', () => {
    expect(
      partTwoStream(
        new AOCInput(
          'two1nine\neightwothree\nabcone2threexyz\nxtwone3four\n4nineeightseven2\nzoneight234\n7pqrstsixteen',
        ),
      ),
    ).toBe(281);
  });
  it('Passes Part 1', () => {
    expect(partOneStream(input)).toBe(55090);
  });
  it('Passes Part 2', () => {
    expect(partTwoStream(input)).toBe(54845);
  });
});

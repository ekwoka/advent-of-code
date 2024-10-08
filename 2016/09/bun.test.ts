import { partOne, partTwo } from '.';
import { AOCInput, getInput, getInputRaw } from '../../utils';

describe('2016 Day 9', async () => {
  const input = await getInput(2016, 9);
  it.skip('Passes Part 1 Test', () => {
    expect(
      partOne(
        new AOCInput(
          'ADVENT-A(1x5)BC-(3x3)XYZ-A(2x2)BCD(2x2)EFG-(6x1)(1x3)A-X(8x2)(3x3)ABCY',
        ),
      ),
    ).toBe(62);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(70_186);
  }, 15_000);
  it.skip('Passes Part 2 Test', () => {
    expect(partTwo(new AOCInput('(3x3)XYZ'))).toBe(9);
    expect(partTwo(new AOCInput('X(8x2)(3x3)ABCY'))).toBe(
      'XABCABCABCABCABCABCY'.length,
    );
    expect(partTwo(new AOCInput('(27x12)(20x12)(13x14)(7x10)(1x12)A'))).toBe(
      241_920,
    );

    expect(
      partTwo(
        new AOCInput(
          '(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN',
        ),
      ),
    ).toBe(445);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(10_915_059_201);
  }, 15_000);
});
describe('2016 Day 9 Rust', async () => {
  const input = await getInputRaw(2016, 9);
  const { part_one, part_two } = await import('./main.rs');
  it.skip('Passes Part 1 Test', () => {
    expect(
      part_one(
        'ADVENT-A(1x5)BC-(3x3)XYZ-A(2x2)BCD(2x2)EFG-(6x1)(1x3)A-X(8x2)(3x3)ABCY',
      ),
    ).toBe(62);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(70_186);
  }, 15_000);
  it.skip('Passes Part 2 Test', () => {
    expect(part_two('(3x3)XYZ')).toBe(9);
    expect(part_two('X(8x2)(3x3)ABCY')).toBe('XABCABCABCABCABCABCY'.length);
    expect(part_two('(27x12)(20x12)(13x14)(7x10)(1x12)A')).toBe(241_920);

    expect(
      part_two('(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN'),
    ).toBe(445);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(10_915_059_201);
  }, 15_000);
});

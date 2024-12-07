import { getInputRaw } from '../../utils';

const input = await getInputRaw(2024, 7);

const sample = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

describe('2024 Day 7 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample)).toBe(3_749n);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(20665830408335n);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two(sample)).toBe(11387n);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(354060705047464n);
  }, 15_000);
});

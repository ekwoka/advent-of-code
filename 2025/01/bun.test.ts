import { getInputRaw } from '../../utils';

const input = await getInputRaw(2025, 1);

const sample = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;
describe('2025 Day 1 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample)).toBe(3);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(962);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two(sample)).toBe(6);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(5782);
  }, 15_000);
});

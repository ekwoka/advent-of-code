import { getInputRaw } from '../../utils';

const input = await getInputRaw(2025, 9);

const sample = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;
describe('2025 Day 9 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample)).toBe(50n);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(4_765_757_080n);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two(sample)).toBe(24n);
  }, 15_000);
  it('Passes Part 2', () => {
    let result = part_two(input);
    expect(result).toBe(1_498_673_376n);
  }, 15_000);
});

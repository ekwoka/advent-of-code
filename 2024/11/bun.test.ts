import { getInputRaw } from '../../utils';

const input = await getInputRaw(2024, 11);

const sample = `125 17`;
describe('2024 Day 11 Rust', async () => {
  const { part_one } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample, 6)).toBe(22n);
    expect(part_one(sample, 25)).toBe(55_312n);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input, 25)).toBe(220_722n);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_one(input, 75)).toBe(261_952_051_690_787n);
  }, 15_000);
});

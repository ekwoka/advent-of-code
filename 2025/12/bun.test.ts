import { getInputRaw } from '../../utils';

const input = await getInputRaw(2025, 12);

describe('2025 Day 12 Rust', async () => {
  const { part_one } = await import('./main.rs');
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(472);
  }, 15_000);
});

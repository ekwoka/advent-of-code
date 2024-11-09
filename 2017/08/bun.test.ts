import { getInputRaw } from '../../utils';

const input = await getInputRaw(2017, 8);
describe('2017 Day 8 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it.skip('Passes Part 1 Test', () => {
    expect(
      part_one(`b inc 5 if a > 1
a inc 1 if b < 5
c dec -10 if a >= 1
c inc -20 if c == 10`),
    ).toBe(1);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(6_012);
  }, 15_000);
  it.skip('Passes Part 2 Test', () => {
    expect(
      part_two(`b inc 5 if a > 1
a inc 1 if b < 5
c dec -10 if a >= 1
c inc -20 if c == 10`),
    ).toBe(10);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(6_369);
  }, 15_000);
});

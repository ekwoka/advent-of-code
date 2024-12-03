import { getInputRaw } from '../../utils';

const input = await getInputRaw(2024, 3);
describe('2024 Day 3 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(
      part_one(
        'xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))',
      ),
    ).toBe(161);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(190_604_937);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(
      part_two(
        `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`,
      ),
    ).toBe(48);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(82_857_512);
  }, 15_000);
});

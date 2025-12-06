import { getInputRaw } from '../../utils';

const input = await getInputRaw(2025, 6);

const sample = `123 328  51 64
 45 64  387 23
  6 98  215 314
*   +   *   +  `;
describe('2025 Day 6 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample)).toBe(4_277_556n);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(4_309_240_495_780n);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two(sample)).toBe(3_263_827n);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(9_170_286_552_289n);
  }, 15_000);
});

import { getInputRaw } from '../../utils';

const input = await getInputRaw(2024, 13);

const sample = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`;
describe('2024 Day 13 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample)).toBe(480);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(31_761);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(90_798_500_745_591n);
  }, 15_000);
});

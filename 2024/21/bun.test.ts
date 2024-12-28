import { getInputRaw } from '../../utils';

const input = await getInputRaw(2024, 21);

const sample = `029A
980A
179A
456A
379A`;
describe('2024 Day 21 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample)).toBe(126_384);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(136_780);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two(sample, 2)).toBe(BigInt(part_one(sample)));
    expect(part_two(input, 2)).toBe(BigInt(part_one(input)));
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input, 25)).toBeLessThan(167_709_506_993_236n);
    expect(part_two(input, 25)).toBe(0n);
  }, 15_000);
});

// 029A: <vA<AA>>^AvAA<^A>Av<<A>>^AvA^A<vA>^Av<<A>^A>AAvA^Av<<A>A>^AAAvA<^A>A
// ----: <vA<AA>>^AvAA<^A>Av<<A>>^AvA^A<vA^>Av<<A>^A>AAvA^Av<<A>A^>AAA<Av>A^A

// 980A: v<<A>>^AAAvA^A<vA<AA>>^AvAA<^A>Av<<A>A>^AAAvA<^A>A<vA>^A<A>A
// ----: v<<A>>^AAAvA^A<vA<AA>>^AvAA<^A>Av<<A>A^>AAA<Av>A^A<vA^>A<A>A

// 179A: v<<A>>^A<vA<A>>^AAvAA<^A>Av<<A>>^AAvA^A<vA>^AA<A>Av<<A>A>^AAAvA<^A>A
// ----: v<<A>>^A<vA<A>>^AAvAA<^A>Av<<A>>^AAvA^A<vA^>AA<A>Av<<A>A^>AAA<Av>A^A

// 456A: v<<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^A<A>A<vA>^A<A>Av<<A>A>^AAvA<^A>A
// ----: v<<A>>^AA<vA<A>>^AAvAA<^A>A<vA^>A<A>A<vA^>A<A>Av<<A>A^>AA<Av>A^A

// 379A: v<<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>Av<<A>A>^AAAvA<^A>A
// ----: v<<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA^>AA<A>Av<<A>A^>AAA<Av>A^A

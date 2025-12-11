import { getInputRaw } from '../../utils';

const input = await getInputRaw(2025, 11);

const sample = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`;
const sample2 = `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`;
describe('2025 Day 11 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample)).toBe(5);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(543);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two(sample2)).toBe(2n);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(479_511_112_939_968n);
  }, 15_000);
});

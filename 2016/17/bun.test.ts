import { partOne, partTwo } from '.';
import { getInputRaw } from '../../utils';

const input = await getInputRaw(2016, 17);
describe('2016 Day 17', async () => {
  it.skip('Passes Part 1 Test', () => {
    expect(partOne('hijkl')).toBe('');
    expect(partOne('ihgpwlah')).toBe('DDRRRD');
    expect(partOne('kglvqrro')).toBe('DDUDRLRRUDRD');
    expect(partOne('ulqzkmiv')).toBe('DRURDRUDDLLDLUURRDULRLDUUDDDRR');
  }, 15_000);
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe('RDRDUDLRDR');
  }, 15_000);
  it.skip('Passes Part 2 Test', () => {
    expect(partTwo('ihgpwlah')).toBe(370);
    expect(partTwo('kglvqrro')).toBe(492);
    expect(partTwo('ulqzkmiv')).toBe(830);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(386);
  }, 15_000);
});

/*
  describe('2016 Day 1 Rust', async () => {
    const { part_one, part_two } = await import('./main.rs');
    it.skip('Passes Part 1 Test', () => {
      expect(part_one('')).toBe(0);
    }, 15_000);
    it('Passes Part 1', () => {
      expect(part_one(input)).toBe(0);
    }, 15_000);
    it.skip('Passes Part 2 Test', () => {
      expect(part_two('')).toBe(0);
    }, 15_000);
    it('Passes Part 2', () => {
      expect(part_two(input)).toBe(0);
    }, 15_000);
  });
*/

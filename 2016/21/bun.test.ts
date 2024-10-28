import { partOne, partTwo } from '.';
import { getInputRaw } from '../../utils';

const input = await getInputRaw(2016, 21);
describe('2016 Day 21', async () => {
  it.skip('Passes Part 1 Test', () => {
    expect(
      partOne(
        `swap position 4 with position 0
swap letter d with letter b
reverse positions 0 through 4
rotate left 1 step
move position 1 to position 4
move position 3 to position 0
rotate based on position of letter b
rotate based on position of letter d`,
        'abcde',
      ),
    ).toBe('decab');
  }, 15_000);
  it('Passes Part 1', () => {
    expect(partOne(input, 'abcdefgh')).toBe('cbeghdaf');
  }, 15_000);
  it.skip('Passes Part 2 Test', () => {
    for (let i = 1; i < input.split('\n').length; i++) {
      expect(
        partTwo(
          input.split('\n').slice(0, i).join('\n'),
          partOne(input.split('\n').slice(0, i).join('\n'), 'cbeghdaf'),
        ),
      ).toBe('cbeghdaf');
    }
    expect(partTwo(input, 'cbeghdaf')).toBe('abcdefgh');
  });
  it('Passes Part 2', () => {
    expect(partTwo(input, 'fbgdceah')).toBe('bacdefgh');
  }, 15_000);
});

/*
  describe('2016 Day 21 Rust', async () => {
    const { part_one, part_two } = await import('./main.rs');
    it.skip('Passes Part 1 Test', () => {
      expect(part_one('')).toBe('');
    }, 15_000);
    it('Passes Part 1', () => {
      expect(part_one(input)).toBe('');
    }, 15_000);
    it.skip('Passes Part 2 Test', () => {
      expect(part_two('')).toBe('');
    }, 15_000);
    it('Passes Part 2', () => {
      expect(part_two(input)).toBe('');
    }, 15_000);
  });
*/

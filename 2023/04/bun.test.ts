import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';
import { part_one, part_two } from './main-day4.rs';

const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 4', async () => {
  const input = await getInput(2023, 4);
  describe('in TypeScript', () => {
    it.skip('Passes Part 1 Test', () => {
      expect(
        partOne(
          new AOCInput(
            'Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53\nCard 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19\nCard 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1\nCard 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83\nCard 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36\nCard 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11',
          ),
        ),
      ).toBe(13);
    });
    it.skip('Passes Part 2 Test', () => {
      expect(
        partTwo(
          new AOCInput(
            'Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53\nCard 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19\nCard 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1\nCard 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83\nCard 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36\nCard 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11',
          ),
        ),
      ).toBe(30);
    });
    it.skip('Passes Part 1', () => {
      expect(partOne(input)).toBe(20855);
    });
    it('Passes Part 2', () => {
      expect(partTwo(input)).toBe(5489600);
    });
  });
  describe('in Rust', () => {
    it.skip('Passes Part 1 Test', () => {
      expect(
        part_one(
          toStr(
            'Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53\nCard 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19\nCard 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1\nCard 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83\nCard 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36\nCard 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11',
          ),
        ),
      ).toBe(13);
    });
    it.skip('Passes Part 2 Test', () => {
      expect(
        part_two(
          toStr(
            'Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53\nCard 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19\nCard 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1\nCard 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83\nCard 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36\nCard 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11',
          ),
        ),
      ).toBe(30);
    });
    it('Passes Part 1', () => {
      expect(part_one(toStr(input.toString()))).toBe(20855);
    });
    it('Passes Part 2', () => {
      expect(part_two(toStr(input.toString()))).toBe(5489600);
    });
  });
});

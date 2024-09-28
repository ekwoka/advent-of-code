import { partOne } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 25', async () => {
  const input = await getInput(2015, 25);
  it('Passes Part 1 Test', () => {
    expect(
      partOne(
        new AOCInput(
          'To continue, please consult the code grid in the manual.  Enter the code at row 4, column 3.',
        ),
      ),
    ).toBe(21_345_942n);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(9_132_360n);
  });
});

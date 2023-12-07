import { AOCInput } from '../../utils';

export const partOne = (input: AOCInput) => {
  const { symbolCoords, numberCoords } = getMemberCoords(input);
  return symbolCoords
    .toIter()
    .map(([x, y]) => collectNumbersAtCoord(numberCoords, x, y))
    .map((nums) => new Set(nums).toIter().sum())
    .sum();
};

const getMemberCoords = (input: AOCInput) => {
  const symbolCoords = new Set<[number, number]>();
  const numberCoords: CoordHash = {};
  input
    .lines()
    .enumerate()
    .forEach(([y, line]) => {
      const chars = line.chars().peekable();
      return chars
        .map((ch) => {
          if (ch === '.') return ch as string;
          if (!isNumberString(ch)) return '$';
          let output = Number(ch);
          let count = 0;
          while (isNumberString(chars.peek().value)) {
            count++;
            output = output * 10 + Number(chars.next().value);
          }
          if (count === 0) return output;
          return Array<number>(count + 1).fill(output);
        })
        .flat()
        .enumerate()
        .forEach(([x, ch]) => {
          if (ch === '.') return ch;
          if (typeof ch === 'number') (numberCoords[y] ??= {})[x] = ch;
          else symbolCoords.add([x, y]);
        });
    });
  return { symbolCoords, numberCoords };
};

export const isNumberString = (str: string) => !Number.isNaN(Number(str));

export const partTwo = (input: AOCInput) => {
  const { symbolCoords, numberCoords } = getMemberCoords(input);
  return symbolCoords
    .toIter()
    .map(([x, y]) => collectNumbersAtCoord(numberCoords, x, y))
    .map((nums) => new Set(nums))
    .filter((sum) => sum.size === 2)
    .map((sum) => sum.toIter().reduce((a, b) => a * b, 1))
    .sum();
};

type CoordHash = Record<number, Record<number, number>>;
[1, [2, 3]].flat();
const offsets = [-1, 0, 1]
  .map((y) => [-1, 0, 1].map((x) => [x, y] as const))
  .flat(1)
  .filter(([x, y]) => x !== 0 || y !== 0);
const collectNumbersAtCoord = (
  coords: CoordHash,
  x: number,
  y: number,
): number[] =>
  offsets.map(([xO, yO]) => coords[y + yO]?.[x + xO]).filter(Boolean);

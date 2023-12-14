import { AOCInput } from '../../utils';

/**
 * --- Day 14: ??? ---
 */
export const partOne = (input: AOCInput): number => {
  return input
    .chars()
    .scan(
      ([state], ch: Space) => {
        const [position, _, nextOpen] = state;
        nextOpen[position[0]] ??= 0;
        switch (ch) {
          case Space.NewLine:
            state[0] = [0, position[1] + 1];
            return state[1];
          case Space.Static:
            nextOpen[position[0]] = position[1] + 1;
            position[0]++;
            return 0;
          case Space.Open:
            position[0]++;
            return 0;
          case Space.Rolling: {
            const moveTo = nextOpen[position[0]];
            nextOpen[position[0]]++;
            position[0]++;
            state[1]++;
            return position[1] - moveTo;
          }
        }
      },
      [[0, 0], 0, []] as [
        position: [x: number, y: number],
        rocksBefore: number,
        nextOpen: number[],
      ],
    )
    .sum();
};

const CYCLES = 1_000_000_000;
export const partTwo = (input: AOCInput): number => {
  const platform = input
    .lines()
    .map<Space[]>((line) => line.chars().collect() as Space[])
    .collect() as Space[][];
  const height = platform.length;
  const width = platform[0].length;
  let currentState = makeKey(platform);
  const stateMapping = new Map<string, [string, number]>();
  let skipped = false;
  for (let i = 0; i < CYCLES; i++) {
    if (!skipped && stateMapping.has(currentState)) {
      const cached = stateMapping.get(currentState)!;
      currentState = cached[0];
      const nearEnd = CYCLES - ((CYCLES - i) % (i - cached[1]));
      i = nearEnd;
      skipped = true;
      continue;
    }
    const platform = extractKey(currentState);
    for (let direction = 0; direction < 4; direction++)
      bubbleRocks(platform, height, width, 1 << direction);
    const newKey = makeKey(platform);
    stateMapping.set(currentState, [newKey, i]);
    currentState = newKey;
  }
  return calculateLoad(extractKey(currentState));
};

const calculateLoad = (platform: Space[][]) =>
  platform
    .toIter()
    .enumerate()
    .map(
      ([y, line]) =>
        (platform.length - y) *
        line
          .toIter()
          .filter((ch) => ch === Space.Rolling)
          .count(),
    )
    .sum();

const makeKey = (platform: Space[][]) =>
  `${platform.map((line) => line.join('')).join('-')}`;

const extractKey = (key: string) => {
  const platform = key.split('-').map((line) => line.split('') as Space[]);
  return platform;
};

const bubbleRocks = (
  platform: Space[][],
  height: number,
  width: number,
  dir: Direction,
) => {
  const transpose = Boolean(dir & Direction.Vertical);
  const [outer, inner] = transpose ? [width, height] : [height, width];
  const fromBack = Boolean(dir & Direction.SouthEast);
  const get = transpose
    ? (x: number, y: number) => platform[x][y]
    : (x: number, y: number) => platform[y][x];
  const set = transpose
    ? (x: number, y: number, ch: Space) => (platform[x][y] = ch)
    : (x: number, y: number, ch: Space) => (platform[y][x] = ch);
  for (let y = 0; y < outer; y++) {
    let openSpace = fromBack ? inner - 1 : 0;
    for (
      let x = fromBack ? inner - 1 : 0;
      x < inner && x >= 0;
      x += fromBack ? -1 : 1
    ) {
      const ch = get(x, y);
      if (ch === Space.Static) {
        openSpace = fromBack ? x - 1 : x + 1;
      } else if (ch === Space.Rolling) {
        if (openSpace !== x) {
          set(openSpace, y, Space.Rolling);
          set(x, y, Space.Open);
          openSpace += fromBack ? -1 : 1;
        } else openSpace = fromBack ? x - 1 : x + 1;
      }
    }
  }
};

enum Direction {
  North = 0b1,
  West = 0b10,
  South = 0b100,
  East = 0b1000,
  NorthEast = North | East,
  NorthWest = North | West,
  SouthEast = South | East,
  SouthWest = South | West,
  Vertical = North | South,
  Horizontal = East | West,
}

enum Space {
  Open = '.',
  Static = '#',
  Rolling = 'O',
  NewLine = '\n',
}

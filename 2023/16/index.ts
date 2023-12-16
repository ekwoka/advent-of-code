import { range } from '@ekwoka/rust-ts';
import { AOCInput } from '../../utils';

/**
 *--- Day 16: The Floor Will Be Lava ---
 */
export const partOne = (input: AOCInput): number => {
  const spaces = input
    .lines()
    .map((line) => line.chars().sum())
    .collect();
  const max = {
    x: spaces[0].length,
    y: spaces.length,
  };
  const visited = new Set<string>();
  const stack: [x: number, y: number, dir: Direction][] = [
    [0, 0, Direction.Right],
  ];
  while (stack.length) {
    const [x, y, dir] = stack.pop();

    if (visited.has(`${x},${y}-${dir}`)) continue;
    if (x < 0 || y < 0 || x >= max.x || y >= max.y) continue;
    visited.add(`${x},${y}-${dir}`);
    let currentSpace = spaces[y][x];
    if (currentSpace === Mirrors.HorizontalSplitter) {
      if (dir === Direction.Right || dir === Direction.Left) {
        currentSpace = Mirrors.Empty;
      } else {
        for (const newDir of [Direction.Right, Direction.Left]) {
          const offset = dirToOffset(newDir);
          stack.push([x + offset[0], y + offset[1], newDir]);
        }
      }
    } else if (currentSpace === Mirrors.VerticalSplitter) {
      if (dir === Direction.Up || dir === Direction.Down) {
        currentSpace = Mirrors.Empty;
      } else {
        for (const newDir of [Direction.Up, Direction.Down]) {
          const offset = dirToOffset(newDir);
          stack.push([x + offset[0], y + offset[1], newDir]);
        }
      }
    } else if (
      currentSpace === Mirrors.RightSlanted ||
      currentSpace === Mirrors.LeftSlanted
    ) {
      const newDir = changeDirection[currentSpace][dir];
      const offset = dirToOffset(newDir);
      stack.push([x + offset[0], y + offset[1], newDir]);
    }
    if (currentSpace === Mirrors.Empty) {
      const offset = dirToOffset(dir);
      stack.push([x + offset[0], y + offset[1], dir]);
    }
  }

  const strictVisited = visited
    .toIter()
    .map((key) => key.split('-')[0])
    .fold((set, location) => set.add(location), new Set());
  return strictVisited.size;
};

const dirToOffset = (dir: Direction) => {
  if (dir === Direction.Right) return [1, 0];
  if (dir === Direction.Left) return [-1, 0];
  if (dir === Direction.Up) return [0, -1];
  if (dir === Direction.Down) return [0, 1];
  return [0, 0];
};

export const partTwo = (input: AOCInput): number => {
  const spaces = input
    .lines()
    .map((line) => line.chars().sum())
    .collect();
  const max = {
    x: spaces[0].length,
    y: spaces.length,
  };
  const halfSize = max.x + max.y;
  const dirs = [Direction.Right, Direction.Up, Direction.Left, Direction.Down];
  const xFromEntry = (entry: number) =>
    Math.max(
      0,
      Math.min(
        entry > halfSize
          ? -(entry % halfSize) + halfSize - 1
          : (entry - max.y) % halfSize,
        max.x - 1,
      ),
    );
  const yFromEntry = (entry: number) =>
    Math.max(
      0,
      Math.min(
        entry > halfSize ? -(entry % halfSize) + max.y : entry % halfSize,
        max.y - 1,
      ),
    );
  return range(0, (max.x + max.y) * 2 - 1)
    .map(
      (entry) =>
        [
          xFromEntry(entry),
          yFromEntry(entry),
          dirs[(entry / max.x) | 0],
        ] as const,
    )
    .map((start) => {
      const visited = new Set<string>();
      const stack: (readonly [x: number, y: number, dir: Direction])[] = [
        start,
      ];
      while (stack.length) {
        const [x, y, dir] = stack.pop();

        if (visited.has(`${x},${y}-${dir}`)) continue;
        if (x < 0 || y < 0 || x >= max.x || y >= max.y) continue;
        visited.add(`${x},${y}-${dir}`);
        let currentSpace = spaces[y][x];
        if (currentSpace === Mirrors.HorizontalSplitter) {
          if (dir === Direction.Right || dir === Direction.Left) {
            currentSpace = Mirrors.Empty;
          } else {
            for (const newDir of [Direction.Right, Direction.Left]) {
              const offset = dirToOffset(newDir);
              stack.push([x + offset[0], y + offset[1], newDir]);
            }
          }
        } else if (currentSpace === Mirrors.VerticalSplitter) {
          if (dir === Direction.Up || dir === Direction.Down) {
            currentSpace = Mirrors.Empty;
          } else {
            for (const newDir of [Direction.Up, Direction.Down]) {
              const offset = dirToOffset(newDir);
              stack.push([x + offset[0], y + offset[1], newDir]);
            }
          }
        } else if (
          currentSpace === Mirrors.RightSlanted ||
          currentSpace === Mirrors.LeftSlanted
        ) {
          const newDir = changeDirection[currentSpace][dir];
          const offset = dirToOffset(newDir);
          stack.push([x + offset[0], y + offset[1], newDir]);
        }
        if (currentSpace === Mirrors.Empty) {
          const offset = dirToOffset(dir);
          stack.push([x + offset[0], y + offset[1], dir]);
        }
      }

      const strictVisited = visited
        .toIter()
        .map((key) => key.split('-')[0])
        .fold((set, location) => set.add(location), new Set());
      return strictVisited.size;
    })
    .max();
};

enum Direction {
  Up = '^',
  Down = 'v',
  Left = '<',
  Right = '>',
}

enum Mirrors {
  VerticalSplitter = '|',
  HorizontalSplitter = '-',
  RightSlanted = '/',
  LeftSlanted = '\\',
  Empty = '.',
}

const changeDirection = {
  '/': {
    [Direction.Up]: Direction.Right,
    [Direction.Right]: Direction.Up,
    [Direction.Down]: Direction.Left,
    [Direction.Left]: Direction.Down,
  },
  '\\': {
    [Direction.Up]: Direction.Left,
    [Direction.Right]: Direction.Down,
    [Direction.Down]: Direction.Right,
    [Direction.Left]: Direction.Up,
  },
};

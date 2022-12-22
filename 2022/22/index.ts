import { readFile } from 'node:fs/promises';

const input: string = await readFile('input.txt', 'utf8');

const parseInput = (input: string) => {
  const [mapString, instructionsString] = input.split('\n\n');
  const gridMap = mapString.split('\n').map((row) => row.split(''));
  const instructions = instructionsString
    .trim()
    .replaceAll('L', ' L ')
    .replaceAll('R', ' R ')
    .split(' ');

  return [gridMap, instructions] as [string[][], string[]];
};

const offsets = {
  U: [0, -1] as Coord,
  D: [0, 1] as Coord,
  L: [-1, 0] as Coord,
  R: [1, 0] as Coord,
};

const directions = {
  UP: {
    L: 'LEFT',
    R: 'RIGHT',
  },
  DOWN: {
    L: 'RIGHT',
    R: 'LEFT',
  },
  LEFT: {
    L: 'DOWN',
    R: 'UP',
  },
  RIGHT: {
    L: 'UP',
    R: 'DOWN',
  },
};

const _walkMap = (map: string[][], instructions: string[]) => {
  let dir = 'RIGHT';
  let pos: Coord = [map[0].findIndex((cell) => cell === '.'), 0];
  for (const instruction of instructions) {
    const currentOffsets = offsets[dir];
    if (/\d+/.test(instruction)) {
      const steps = Number(instruction);
      for (let i = 0; i < steps; i++) {
        let next = [
          pos[0] + currentOffsets[0],
          pos[1] + currentOffsets[1],
        ] as Coord;
        if (
          map[next[1]]?.[next[0]] === undefined ||
          map[next[1]][next[0]] === ' '
        ) {
          next = pos;
          while (map[next[1]]?.[next[0]] && map[next[1]]?.[next[0]] !== ' ') {
            next = [
              next[0] + currentOffsets[0] * -1,
              next[1] + currentOffsets[1] * -1,
            ] as Coord;
          }
          next = [next[0] + currentOffsets[0], next[1] + currentOffsets[1]];
        }
        if (map[next[1]][next[0]] === '#') break;
        map[next[1]][next[0]] = 'X';
        pos = next;
      }
    } else {
      dir = directions[dir][instruction];
    }
  }
  const result =
    4 * (pos[0] + 1) +
    1000 * (pos[1] + 1) +
    ['RIGHT', 'DOWN', 'LEFT', 'UP'].indexOf(dir);
  return result;
};

const getGridFaces = (map: string[][]) => {
  const sideSize = 50;
  const verticalSlices: string[][][] = [];
  for (let i = 0; i < map.length; i += sideSize) {
    verticalSlices.push(map.slice(i, i + sideSize));
  }
  const allFaces = verticalSlices
    .map((slice) => {
      const faces: string[][][] = [];
      for (let i = 0; i < slice[0].length; i += sideSize) {
        const face: string[][] = [];
        for (let j = 0; j < slice.length; j++) {
          face.push(slice[j].slice(i, i + sideSize));
        }
        faces.push(face);
      }
      return faces;
    })
    .flat()
    .filter((face) => face[0][0] !== ' ');
  const faceMapping = {
    A: {
      grid: allFaces[0],
      U(coord: Coord): EdgeWrap {
        return ['F', 'R', [0, coord[0]]];
      },
      R(coord: Coord): EdgeWrap {
        return ['B', 'R', [0, coord[1]]];
      },
      D(coord: Coord): EdgeWrap {
        return ['C', 'D', [coord[0], 0]];
      },
      L(coord: Coord): EdgeWrap {
        return ['D', 'R', [0, 49 - coord[1]]];
      },
    },
    B: {
      grid: allFaces[1],
      U(coord: Coord): EdgeWrap {
        return ['F', 'U', [coord[0], 49]];
      },
      R(coord: Coord): EdgeWrap {
        return ['E', 'L', [49, 49 - coord[1]]];
      },
      D(coord: Coord): EdgeWrap {
        return ['C', 'L', [49, coord[0]]];
      },
      L(coord: Coord): EdgeWrap {
        return ['A', 'L', [49, coord[1]]];
      },
    },
    C: {
      grid: allFaces[2],
      U(coord: Coord): EdgeWrap {
        return ['A', 'U', [coord[0], 49]];
      },
      R(coord: Coord): EdgeWrap {
        return ['B', 'U', [coord[1], 49]];
      },
      D(coord: Coord): EdgeWrap {
        return ['E', 'D', [coord[0], 0]];
      },
      L(coord: Coord): EdgeWrap {
        return ['D', 'D', [coord[1], 0]];
      },
    },
    D: {
      grid: allFaces[3],
      U(coord: Coord): EdgeWrap {
        return ['C', 'R', [0, coord[0]]];
      },
      R(coord: Coord): EdgeWrap {
        return ['E', 'R', [0, coord[1]]];
      },
      D(coord: Coord): EdgeWrap {
        return ['F', 'D', [coord[0], 0]];
      },
      L(coord: Coord): EdgeWrap {
        return ['A', 'R', [0, 49 - coord[1]]];
      },
    },
    E: {
      grid: allFaces[4],
      U(coord: Coord): EdgeWrap {
        return ['C', 'U', [coord[0], 49]];
      },
      R(coord: Coord): EdgeWrap {
        return ['B', 'L', [49, 49 - coord[1]]];
      },
      D(coord: Coord): EdgeWrap {
        return ['F', 'L', [49, coord[0]]];
      },
      L(coord: Coord): EdgeWrap {
        return ['D', 'L', [49, coord[1]]];
      },
    },
    F: {
      grid: allFaces[5],
      U(coord: Coord): EdgeWrap {
        return ['D', 'U', [coord[0], 49]];
      },
      R(coord: Coord): EdgeWrap {
        return ['E', 'U', [coord[1], 49]];
      },
      D(coord: Coord): EdgeWrap {
        return ['B', 'D', [coord[0], 0]];
      },
      L(coord: Coord): EdgeWrap {
        return ['A', 'D', [coord[1], 0]];
      },
    },
  };
  return faceMapping;
};

const getRowColumnOffsetFromFace = (face: string) => {
  switch (face) {
    case 'A':
      return [51, 1];
    case 'B':
      return [101, 1];
    case 'C':
      return [51, 51];
    case 'D':
      return [1, 101];
    case 'E':
      return [51, 101];
    case 'F':
      return [1, 151];
  }
  return [1, 1];
};

const dirToPoint = (dir: string) => {
  switch (dir) {
    case 'R':
      return 0;
    case 'D':
      return 1;
    case 'L':
      return 2;
    case 'U':
      return 3;
  }
  return 0;
};

const drawGrid = (map: string[][]) => {
  console.log(map.map((row) => row.join('')).join('\n'));
};

const walkCube = (map: string[][], instructions: string[]) => {
  const faces = getGridFaces(map);
  let pos: Coord = [0, 0];
  let currentFace = 'A';
  const dirs = ['R', 'D', 'L', 'U'];
  let dir = 'R';
  for (const instruction of instructions) {
    if (/\d+/.test(instruction)) {
      let steps = Number(instruction);
      while (steps--) {
        faces[currentFace].grid[pos[1]][pos[0]] = dir;
        const next = [
          pos[0] + offsets[dir][0],
          pos[1] + offsets[dir][1],
        ] as Coord;
        if (next[0] < 0 || next[0] > 49 || next[1] < 0 || next[1] > 49) {
          const [nextFace, nextDir, nextCoord] = faces[currentFace][dir](pos);
          if (faces[nextFace].grid[nextCoord[1]][nextCoord[0]] === '#') break;
          currentFace = nextFace;
          dir = nextDir;
          pos = nextCoord;
        } else {
          if (faces[currentFace].grid[next[1]][next[0]] === '#') break;
          pos = next;
        }
      }
    } else {
      dir =
        dirs[
          (dirs.indexOf(dir) + (instruction === 'L' ? -1 : 1) + dirs.length) %
            dirs.length
        ];
    }
  }
  Object.entries(faces).forEach(([face, { grid }]) => {
    console.log(face, '\n');
    drawGrid(grid);
  });
  console.log(currentFace, pos, dir);
  const [columnOffset, rowOffset] = getRowColumnOffsetFromFace(currentFace);
  const [column, row] = pos;
  return (
    1000 * (row + rowOffset) + 4 * (column + columnOffset) + dirToPoint(dir)
  );
};

const [grid, instructions] = parseInput(input);

// console.log('Part One:', '\n', walkMap(grid, instructions));
console.log('Part Two:', '\n', walkCube(grid, instructions));

type Coord = [number, number];

type EdgeWrap = [string, string, Coord];

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/**
 * --- Day 15: Beacon Exclusion Zone ---
 * Part 1: 23:25:39  27837
 * Part2: >24h  22296
 * Had a lot of trouble with this one in my initial implementations and needed to get back to real work so I had to leave it for a while.
 * Initial plan used too much memory brute forcing, then it took too long, and then I refactored to make it faster, but for part 2 was still too long to brute force.
 * After all the refactors to get the answer part 1 completes in .8ms and part 2 in 1.5ms.
 */
import { readFile } from 'node:fs/promises';

const input: string = await readFile('input.txt', 'utf8');

// Whole puzzle involves ranges from sensors to beacons by manhatten distance
const getManhattenDistance = ([x1, y1]: Coord, [x2, y2]: Coord) =>
  Math.abs(x1 - x2) + Math.abs(y1 - y2);

// sensors all detect a beacon and that is the nearest beacon they've seen, so anything closer has been seen and is not a beacon
const sensors = input
  .split('\n')
  .filter(Boolean)
  .map((sensor) => {
    const [sX, sY, bX, bY] = Array.from(sensor.matchAll(/-?\d+/g)).map(Number);
    return { sX, sY, bX, bY, r: getManhattenDistance([sX, sY], [bX, bY]) };
  });

type Sensor = (typeof sensors)[0];

const sensorSpaces = new Set(sensors.map(({ sX, sY }) => `${sX},${sY}`));
const beaconSpaces = new Set(sensors.map(({ bX, bY }) => `${bX},${bY}`));

// Simple process for just eliminating irrelevant sensors during a check on a row. Was needed for earlier version and is problably not actually helpful in the current version.
const getSensorsNearRow = (row: number) => {
  return sensors.filter(({ sX, sY, bX, bY }) => {
    const distance = getManhattenDistance([sX, sY], [bX, bY]);
    return sY + distance >= row && sY - distance <= row;
  });
};

// This determines what the is the lowest and highest x coordinates a sensor sees on a given y coordinate
const getRangeOnRow = (sensor: Sensor, row: number) => {
  const { sX, sY, r } = sensor;
  const distance = Math.abs(sY - row);
  const min = sX - (r - distance);
  const max = sX + (r - distance);
  return [min, max];
};

// merges the ranges when they overlap, since we don't need to have each individual sensors coverage
const mergeRanges = (ranges: [number, number][]): [number, number][] => {
  const sortedRanges = ranges.sort(([a], [b]) => a - b);
  const mergedRanges: [number, number][] = [
    sortedRanges.shift() as [number, number],
  ];
  for (const [min, max] of sortedRanges) {
    const [_prevMin, prevMax] = mergedRanges[mergedRanges.length - 1];
    if (prevMax >= min) {
      mergedRanges[mergedRanges.length - 1][1] = Math.max(prevMax, max);
    } else {
      mergedRanges.push([min, max]);
    }
  }
  return mergedRanges;
};

// checks how many spaces are covered by given ranges
const coverageByRanges = (ranges: [number, number][]) =>
  ranges.reduce((acc, [min, max]) => acc + max - min + 1, 0);

// checks if a range is completely contained within another range
const rangeInRange = (
  ranges: [number, number][],
  range: [number, number],
): boolean => {
  const [min, max] = range;
  return ranges.some(([rMin, rMax]) => min >= rMin && max <= rMax);
};

// checks if a number is in any of the ranges
const spaceInRanges = (x: number, ranges: [number, number][]) =>
  ranges.some(([min, max]) => x >= min && x <= max);

// finds the first space that is not covered by any of the ranges
const findMissingSpace = (
  ranges: [number, number][],
  min: number,
  max: number,
) => {
  let lastMax = min;
  for (const [rmin, rmax] of ranges) {
    if (lastMax > max) break;
    if (rmin > lastMax) return lastMax;
    lastMax = rmax + 1;
  }
  return lastMax - 1;
};

// Part 1 consists in finding all the scanned spaces in a given row
const getSpacesOnRow = (row: number) => {
  console.time('getSpacesOnRow');
  console.log('Getting Nearby Sensors');
  const nearbySensors = getSensorsNearRow(row);
  const coveredRanges = mergeRanges(
    nearbySensors.reduce((acc: [number, number][], sensor) => {
      const [min, max] = getRangeOnRow(sensor, row);
      acc.push([min, max]);
      return acc;
    }, []),
  );
  const knownObjects = [...beaconSpaces, ...sensorSpaces].filter((space) => {
    const [x, y] = space.split(',').map(Number);
    if (y === row && spaceInRanges(x, coveredRanges)) return true;
    return false;
  }).length;
  console.timeEnd('getSpacesOnRow');
  return coverageByRanges(coveredRanges) - knownObjects;
};
// Part 2 consists of finding, within a given 2d box, the first space that is not covered by any of the sensors
const getEmptySpaceInBox = (min: number, max: number) => {
  for (let row = max; row >= min; row--) {
    const nearbySensors = getSensorsNearRow(row);
    const coveredRanges = mergeRanges(
      nearbySensors.reduce((acc: [number, number][], sensor) => {
        const [min, max] = getRangeOnRow(sensor, row);
        acc.push([min, max]);
        return acc;
      }, []),
    );
    if (!rangeInRange(coveredRanges, [min, max]))
      return [findMissingSpace(coveredRanges, min, max), row] as Coord;
    if (row % 100000 === 0)
      console.log(`${(((max - row) / (max - min)) * 100).toFixed(1)}%`, 'done');
  }
  console.timeEnd('getSpacesOnRow');
  return;
};

const processCoord = ([x, y]: Coord) => x * 4000000 + y;

console.log('Part One:', getSpacesOnRow(2_000_000));
console.time('Part Two');
console.log(
  'Part Two:',
  processCoord(getEmptySpaceInBox(0, 4_000_000) ?? [0, 0]),
);
console.timeEnd('Part Two');

type Coord = [number, number];

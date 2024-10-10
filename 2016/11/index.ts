import '@ekwoka/rust-ts/prelude';
import { VecDequeue } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';

type Item = [element: string, type: 'microchip' | 'generator'];

type Floor = Item[];
const isSafe = (floors: Floor[]) => {
  return floors.every((floor) =>
    floor.every(
      ([element, type]) =>
        type === 'generator' ||
        floor.some(([e, t]) => e === element && t === 'generator') ||
        !floor.some(([e, t]) => t === 'generator'),
    ),
  );
};

const isReady = (floors: Floor[]) =>
  floors.slice(1).every((floor) => floor.length === 0);

const stateToString = (position: number, floors: Floor[]) => {
  return `${floors
    .iter()
    .enumerate()
    .map(
      ([floor, items]) =>
        `F${4 - floor} ${position === floor ? 'E' : '.'} ${items
          .iter()
          .map((item) => {
            const pair = items
              .iter()
              .find(([e, t]) => e === item[0] && t !== item[1]);
            if (pair) return `${item[0].slice(0, 2).toUpperCase()}P`;
            return `${item[0].slice(0, 2).toUpperCase()}${item[1][0].toUpperCase()}`;
          })
          .into(Set)
          .iter()
          .map((item) => (item[2] === 'P' ? 'P' : item))
          .sort()
          .collect()
          .join(' ')}`,
    )
    .collect()
    .join('\n')}`;
};

const logDiagram = (steps: number, position: number, floors: Floor[]) => {
  console.log(`\n\n${steps}\n${stateToString(position, floors)}`);
};

export const partOne = (input: AOCInput) => {
  const startingState: Floor[] = input
    .lines()
    .filter(Boolean)
    .map(
      (line) =>
        line
          .matchAll(/(\w+)(?:-compatible)? (microchip|generator)/g)
          .iter()
          .map((m) => m.slice(1) as Item)
          .iter()
          .collect() as Floor,
    )
    .reverse()
    .collect();
  const queue: VecDequeue<[steps: number, position: number, floors: Floor[]]> =
    new VecDequeue([[0, 3, startingState]]);
  const visited = new Set<string>();
  while (queue.length) {
    const [steps, position, floors] = queue.shift()!;
    if (isReady(floors)) return steps;
    const topLimit =
      floors.length -
      floors
        .iter()
        .reverse()
        .takeWhile((items) => items.length === 0)
        .count();
    [-1, +1]
      .iter()
      .filter((d) => position + d >= 0 && position + d < topLimit)
      .flatMap((dir) =>
        floors[position]
          .iter()
          .enumerate()
          .flatMap(([i, item]) =>
            floors[position]
              .slice(i + 1)
              .iter()
              .map((item2) => [dir, [item, item2]])
              .chain([[dir, [item]]]),
          ),
      )
      .filter(
        ([_, items]) =>
          !(
            position === 0 &&
            items.length === 2 &&
            items[0][0] === items[1][0]
          ),
      )
      .map(([dir, items]) => [
        dir,
        floors
          .iter()
          .enumerate()
          .map(([i, floor]) =>
            i === position
              ? floor
                  .iter()
                  .filter((jitem) => !items.includes(jitem))
                  .collect()
              : i === position + dir
                ? floor.iter().chain(items).collect()
                : floor.slice(),
          )
          .collect(),
      ])
      .map(([dir, floors]) => [
        dir,
        floors,
        stateToString(position + dir, floors),
      ])
      .filter(([_, __, key]) => !visited.has(key))
      .inspect(([_, __, key]) => visited.add(key))
      .filter(([_, floors]) => isSafe(floors))
      .forEach(([dir, floors]) =>
        queue.push([steps + 1, position + dir, floors]),
      );
  }
};
export const partTwo = (input: AOCInput) => {
  const startingState: Floor[] = input
    .lines()
    .filter(Boolean)
    .map(
      (line) =>
        line
          .matchAll(/(\w+)(?:-compatible)? (microchip|generator)/g)
          .iter()
          .map((m) => m.slice(1) as Item)
          .iter()
          .collect() as Floor,
    )
    .reverse()
    .collect();
  const queue: VecDequeue<[steps: number, position: number, floors: Floor[]]> =
    new VecDequeue([[0, 3, startingState]]);
  const visited = new Set<string>();
  while (queue.length) {
    const [steps, position, floors] = queue.shift()!;
    if (isReady(floors)) return steps + 24; // mathematical offset for two more pairs on the starting floor
    const topLimit =
      floors.length -
      floors
        .iter()
        .reverse()
        .takeWhile((items) => items.length === 0)
        .count();
    [-1, +1]
      .iter()
      .filter((d) => position + d >= 0 && position + d < topLimit)
      .flatMap((dir) =>
        floors[position]
          .iter()
          .enumerate()
          .flatMap(([i, item]) =>
            floors[position]
              .slice(i + 1)
              .iter()
              .map((item2) => [dir, [item, item2]])
              .chain([[dir, [item]]]),
          ),
      )
      .map(([dir, items]) => [
        dir,
        floors
          .iter()
          .enumerate()
          .map(([i, floor]) =>
            i === position
              ? floor
                  .iter()
                  .filter((jitem) => !items.includes(jitem))
                  .collect()
              : i === position + dir
                ? floor.iter().chain(items).collect()
                : floor.slice(),
          )
          .collect(),
      ])
      .map(([dir, floors]) => [
        dir,
        floors,
        stateToString(position + dir, floors),
      ])
      .filter(([_, __, key]) => !visited.has(key))
      .inspect(([_, __, key]) => visited.add(key))
      .filter(([_, floors]) => isSafe(floors))
      .forEach(([dir, floors]) =>
        queue.push([steps + 1, position + dir, floors]),
      );
  }
};

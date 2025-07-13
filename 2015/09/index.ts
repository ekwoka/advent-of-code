import '@ekwoka/rust-ts/prelude';
import type { AOCInput } from '../../utils';

export const partOne = (input: AOCInput): number => {
  const tree = input
    .lines()
    .filter(Boolean)
    .map((line) => line.match(/(\S+) to (\S+) = (\d+)/)!.slice(1))
    .fold((map, [start, end, distance]) => {
      if (!map.has(start)) map.set(start, new Map<string, number>());
      if (!map.has(end)) map.set(end, new Map<string, number>());
      map.get(start)!.set(end, Number(distance));
      map.get(end)!.set(start, Number(distance));
      return map;
    }, new Map<string, Map<string, number>>());
  const queue = tree
    .keys()
    .iter()
    .map((start) => [start, new Set<string>(), 0 as number] as const)
    .collect();
  const addToQueue = (
    next: [currentNode: string, visited: Set<string>, distance: number],
  ) => {
    const insertAt = queue.findIndex((entry) => entry[2] > next[2]);
    if (insertAt > -1) queue.splice(insertAt, 0, next);
    else queue.push(next);
  };

  while (queue.length) {
    const [current, visited, distance] = queue.shift()!;
    if (visited.size + 1 === tree.size) return distance;
    tree.get(current)!.forEach((distanceTo, to) => {
      if (visited.has(to)) return;
      addToQueue([
        to,
        visited.iter().chain([current]).into(Set),
        distance + distanceTo,
      ]);
    });
  }
  return 0;
};

export const partTwo = (input: AOCInput): number => {
  const tree = input
    .lines()
    .filter(Boolean)
    .map((line) => line.match(/(\S+) to (\S+) = (\d+)/)!.slice(1))
    .fold((map, [start, end, distance]) => {
      if (!map.has(start)) map.set(start, new Map<string, number>());
      if (!map.has(end)) map.set(end, new Map<string, number>());
      map.get(start)!.set(end, Number(distance));
      map.get(end)!.set(start, Number(distance));
      return map;
    }, new Map<string, Map<string, number>>());
  const queue: (readonly [
    currentNode: string,
    visited: Set<string>,
    distance: number,
  ])[] = tree
    .keys()
    .iter()
    .map((start) => [start, new Set<string>(), 0] as const)
    .collect();

  return (
    (function* () {
      while (queue.length) {
        const [current, visited, distance] = queue.shift()!;
        if (visited.size + 1 === tree.size) yield distance;
        tree.get(current)!.forEach((distanceTo, to) => {
          if (visited.has(to)) return;
          queue.push([
            to,
            visited.iter().chain([current]).into(Set),
            distance + distanceTo,
          ]);
        });
      }
    })()
      .iter()
      .max() ?? 0
  );
};

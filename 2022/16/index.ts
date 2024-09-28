/**
 * --- Day 16: Proboscidea Volcanium ---
 * Part 1: 02:17:22   2177
 * Part 2: >24h   9840
 * Pretty wild and had a lot of issues with this. It seemed doing some kind of DFS through the caves and adding stuff up as I went would make sense, and it kind of got the job done (slowly) for part 1, but it was entirely inadequate for part 2.
 * After lots of optimizations I got part 2 to go fast enough, but it was wrong!!! Because the way I was memoizing was preventing some paths from being registered
 */
import { CircularBuffer, type RustIterator } from '@ekwoka/rust-ts';
import { getInput } from '../../utils';

// Input is a collections of caves, some with valves that can release some pressure. Basic node list.
const input = await getInput(2022, 16);
const valveMap = Object.fromEntries(
  input
    .lines()
    .filter(Boolean)
    .map((line) => {
      const [valve, tunnels] = line.split(';');
      const label = valve.match(/([A-Z]{2})/)?.[1] ?? 'broken';
      const flowRate = Number(valve.match(/(\d+)/)?.[1] ?? 0);
      const tunnelConnections = Array.from(tunnels.matchAll(/([A-Z]{2})/g)).map(
        (match) => match[1],
      );
      return [label, { flowRate, tunnelConnections }] as const;
    }),
);

// Rooms with no flowRate aren't worth considering as node worth passing through. Those with flowrate are valid nodes
const allValves = Object.entries(valveMap)
  .toIter()
  .map(([valve, { flowRate }]) => (flowRate > 0 ? valve : null))
  .filter(Boolean)
  .collect();

// This is basic pathfinding just to find the time to travel from any valid valve to any other valid valve. Important to prevent moving unproductively into worthless rooms
const getLowestCost = (start: string, end: string) => {
  const queue = new CircularBuffer<{
    room: string;
    cost: number;
    visited: string[];
  }>([{ room: start, cost: 0, visited: [start] }]);
  while (queue.length) {
    const { room, cost, visited } = queue.shift();
    if (room === end) return cost;
    const { tunnelConnections } = valveMap[room];
    if (tunnelConnections.includes(end)) return cost + 1;
    tunnelConnections.forEach((tunnel) => {
      if (!visited.includes(tunnel))
        queue.push({
          room: tunnel,
          cost: cost + 1,
          visited: [...visited, tunnel],
        });
    });
  }
  return -1;
};

const pathCosts = Object.fromEntries(
  ['AA', ...allValves].toIter().map((start) => [
    start,
    Object.fromEntries(
      allValves
        .toIter()
        .filter((end) => end !== start)
        .map((end) => [end, getLowestCost(start, end)]),
    ),
  ]),
);

// I actually found that it was faster to just generate all the possible routes within the time and then process their scores separately as opposed to pathing and calculating as I went. This is mainly because of how Part 2 works, this just allowed more control over ensuring things could be memoized and be smooth enough
const makeAllPaths = (time: number) => {
  const pathList = getRemainingPath(['AA'], [...allValves], 0, time);
  return pathList;
};

function getRemainingPath(
  steps: string[],
  left: string[],
  costThusFar: number,
  time: number,
): RustIterator<string[]> {
  const last = steps[steps.length - 1];
  return [steps].toIter().chain(
    left.toIter().flatMap<RustIterator<string[]>>((next: string) => {
      const cost = pathCosts[last][next];
      if (cost + 1 + costThusFar >= time) return [].toIter();
      return getRemainingPath(
        [...steps, next],
        left
          .toIter()
          .filter((pos) => pos !== next)
          .collect(),
        costThusFar + cost + 1,
        time,
      );
    }),
  );
}

// Takes paths and provides the amount of pressure they can release in the given time. This memoizes paths past a certain point so that the tail end of paths can be sped up. Part 1 simply consists of getting the best path for a single actor moving through and turning valves
const scorePaths = (paths: RustIterator<string[]>, time: number) => {
  const scorePath = (
    opened: string[],
    path: string[],
    timeLeft: number,
    debug = false,
  ): number => {
    const nextStep = path[0];
    const remainingSteps = path.slice(1);
    const nextStepCost = pathCosts[opened[0]][nextStep];
    const flowForStep =
      opened[0] === 'AA' ? 0 : valveMap[opened[0]].flowRate * timeLeft;
    if (!path.length) return flowForStep;
    const pressureReleased = scorePath(
      [path[0], ...opened],
      remainingSteps,
      timeLeft - nextStepCost - 1,
      debug,
    );
    return pressureReleased + flowForStep;
  };
  const pathScores = paths.map(
    (path) =>
      [path, scorePath([path[0]], path.slice(1), time)] as [string[], number],
  );
  return pathScores;
};

// Part 2 gives less time, but you have 2 actors moving through the caves. Since there are too many valves for even two actors to turn them all, one of the best ways to handle this is to just get the scores for all possible paths for a single actor and then find the best two that don't overlap to send the two actors to handle separately.
const getBestCombo = () => {
  const candidates = scorePaths(makeAllPaths(26), 26)
    .filter(([, score]) => !!score)
    .enumerate()
    .map(
      ([i, [path, score]]) =>
        [path.slice(1), score, i] as [string[], number, i: number],
    )
    .collect()
    .sort(([_, valA], [__, valB]) => valB - valA);

  let bestThusFar = 0;
  const bestCombo = candidates
    .toIter()
    .takeWhile(([, score]) => score > ((bestThusFar / 2) | 0))
    .map<number>(([path, score, i]) => {
      const [, pairValue] = candidates
        .toIter()
        .filter(([, , j]) => j > i)
        .takeWhile(([, candidate]) => candidate + score > bestThusFar)
        .find((helper) =>
          helper[0].every((valve) => !path.includes(valve)),
        ) ?? [[''], 0];

      return score && pairValue + score;
    })
    .filter(Boolean)
    .inspect((val) => (bestThusFar = Math.max(bestThusFar, val)))
    .max();
  console.timeEnd('finding best combo');
  return bestCombo;
};

wrapInTime('Part One', () =>
  console.log(
    'Part One:',
    scorePaths(makeAllPaths(30), 30)
      .map(([, val]) => val)
      .max(),
  ),
);
wrapInTime('Part Two', () => console.log('Part Two:', getBestCombo()));

function wrapInTime(label: string, fn: () => void) {
  console.time(label);
  fn();
  console.timeEnd(label);
}

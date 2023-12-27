import { RustIterator, range } from '@ekwoka/rust-ts';
import { AOCInput } from '../../utils';

/**
 * --- Day 25: ??? ---
 */
export const partOne = (input: AOCInput): number => {
  const allConnections = input
    .lines()
    .map((line) => line.splitBy(':'))
    .flatMap(([from, to]) =>
      to
        .words()
        .filter((part) => part.length > 0)
        .map((to) => [from.toString(), to.toString()] as const),
    )
    .collect();
  const connectionMaps = allConnections
    .toIter()
    .fold(intoConnectionsList, {} as Record<string, string[]>);
  const allNodeNames = Object.keys(connectionMaps);
  const getShortest = getShortestDistance(connectionMaps);
  const averageDistances = allNodeNames
    .toIter()
    .map(
      (from) =>
        [
          from,
          allNodeNames
            .toIter()
            .map((to) => getShortest(from, to))
            .sum() /
            (allNodeNames.length - 1),
        ] as const,
    )
    .fold((acc, [k, v]) => ((acc[k] = v), acc), {} as Record<string, number>);
  const lowestAverageConnections = allConnections
    .toIter()
    .map(
      (connection) =>
        [
          connection,
          averageDistances[connection[0]] + averageDistances[connection[1]],
        ] as const,
    )
    .sort(([_, a], [__, b]) => a - b)
    .map(([connection]) => connection)
    .take((allConnections.length / 4) | 0)
    .collect();
  const remainingConnections = range(0, lowestAverageConnections.length - 3)
    .flatMap((i) =>
      range(i + 1, lowestAverageConnections.length - 2).flatMap((j) =>
        range(j + 1, lowestAverageConnections.length - 1).map(
          (k) =>
            [
              lowestAverageConnections[i],
              lowestAverageConnections[j],
              lowestAverageConnections[k],
            ] as const,
        ),
      ),
    )
    .map(
      (possibleRemovals) =>
        [
          possibleRemovals,
          allConnections
            .toIter()
            .filter((combonation) => !possibleRemovals.includes(combonation))
            .fold(intoConnectionsList, {} as Record<string, string[]>),
        ] as const,
    )
    .filter(([_, connections]) => {
      const getShortest = getShortestDistance(connections);
      return range(0, allNodeNames.length - 1)
        .flatMap((i) => zipLoopFrom(allNodeNames, i))
        .map(([from, to]) => getShortest(from, to))
        .any((distance) => distance < 0);
    })
    .map(([_, connections]) => connections)
    .nth(0);
  const queue = [Object.keys(remainingConnections)[0]];
  const connected = new Set<string>();
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (connected.has(node)) continue;
    connected.add(node);
    queue.push(...remainingConnections[node]);
  }
  return connected.size * (allNodeNames.length - connected.size);
};

const getShortestDistance = (connections: Record<string, string[]>) => {
  const cache = new Map<string, number>();
  return (from: string, to: string): number => {
    if (from === to) return 0;
    const key = `${from}:${to}`;
    const key2 = `${to}:${from}`;
    if (cache.has(key)) return cache.get(key)!;
    if (cache.has(key2)) return cache.get(key2)!;
    const visited = new Set<string>([from]);
    const queue = connections[from].map(
      (node) => [node, 1] as [string, number],
    );
    while (queue.length > 0) {
      const [node, distance] = queue.shift()!;
      if (node === to) {
        cache.set(key, distance);
        cache.set(key2, distance);
        return distance;
      }
      if (visited.has(node)) continue;
      visited.add(node);
      queue.push(
        ...connections[node].map(
          (node) => [node, distance + 1] as [string, number],
        ),
      );
    }
    return -Infinity;
  };
};

const intoConnectionsList = (
  acc: Record<string, string[]>,
  [from, to]: [string, string],
) => ((acc[from] ??= []).push(to), (acc[to] ??= []).push(from), acc);

const zipLoopFrom = <T>(it: Array<T>, pivot: number): RustIterator<[T, T]> => {
  const iter = it.toIter();
  return [iter.nth(pivot)].toIter().cycle().zip<T>(iter);
};

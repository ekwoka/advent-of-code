import '@ekwoka/rust-ts/prelude';
import { AOCInput } from '../../utils';
import { Vec2 } from '../../utils/vec';
class Node {
  constructor(
    public location: Vec2,
    public size: number,
    public used: number,
    public avail: number,
  ) {}
  isEmpty() {
    return this.used === 0;
  }
  canFitIn(node: Node) {
    return this.used <= node.avail;
  }

  clone() {
    return new Node(this.location, this.size, this.used, this.avail);
  }

  static from(readout: string) {
    const [_, x, y, s, u, a] = readout
      .match(/x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T/)!
      .map(Number);
    return new Node(new Vec2(x, y), s, u, a);
  }
}

const neighbors = [Vec2.X, Vec2.NEG_X, Vec2.Y, Vec2.NEG_Y];

export const partOne = (input: string) => {
  const stdout = new AOCInput(input).lines();
  stdout.advanceBy(2);
  const nodes = stdout
    .map((line) => line.valueOf())
    .map(Node.from)
    .collect();
  return nodes
    .iter()
    .filter((A) => !A.isEmpty())
    .flatMap((A) =>
      nodes
        .iter()
        .filter((B) => B !== A)
        .filter((B) => A.canFitIn(B))
        .map((B) => [A, B]),
    )
    .count();
};
export const partTwo = (input: string) => {
  const stdout = new AOCInput(input).lines();
  stdout.advanceBy(2);
  let w = 0;
  let h = 0;
  const nodes = stdout
    .map((line) => line.valueOf())
    .map(Node.from)
    .inspect((node) => {
      w = Math.max(w, node.location.x + 1);
      h = Math.max(h, node.location.y + 1);
    })
    .collect();

  const full = new Set(
    nodes
      .iter()
      .filter((n) => n.used > 100)
      .map((n) => n.location.toString()),
  );

  const goal = Vec2.ZERO;
  const target = new Vec2(w - 1, 0);
  const getScore = (steps: number, empty: Vec2, target: Vec2) => {
    const goalVec = target.sub(goal).abs();
    const emptyVec = empty.sub(target).abs();
    return (
      1 * steps + 5 * (goalVec.x + goalVec.y) + 1 * (emptyVec.x + emptyVec.y)
    );
  };
  const visited = new Set<string>();
  const queue: [steps: number, empty: Vec2, target: Vec2, score: number][] =
    nodes
      .iter()
      .filter((node) => node.isEmpty())
      .map(
        (node) =>
          [0, node.location, target, getScore(0, node.location, target)] as [
            steps: number,
            empty: Vec2,
            target: Vec2,
            score: number,
          ],
      )
      .collect();
  const add = (steps: number, empty: Vec2, target: Vec2) => {
    if (visited.has(`${empty.toString()}-${target.toString()}}`)) return;
    visited.add(`${empty.toString()}-${target.toString()}}`);
    const score = getScore(steps, empty, target);
    const insertAt = queue.findIndex((other) => other[3] > score);
    if (insertAt === -1) queue.push([steps, empty, target, score]);
    else queue.splice(insertAt, 0, [steps, empty, target, score]);
  };
  while (queue.length) {
    const [steps, emptyNode, target, score] = queue.shift()!;
    if (target.eq(goal)) return steps;
    neighbors
      .iter()
      .map((o) => emptyNode.add(o))
      .filter((b) => b.x >= 0 && b.y >= 0 && b.x < w && b.y < h)
      .filter((b) => !full.has(b.toString()))
      .forEach((b) => add(steps + 1, b, b.eq(target) ? emptyNode : target));
  }
  return -1;
};

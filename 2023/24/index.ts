import { RustIterator, range } from '@ekwoka/rust-ts';
import { AOCInput } from '../../utils';

/**
 * --- Day 24: Never Tell Me The Odds ---
 */
export const partOne = (
  input: AOCInput,
  limits: [min: number, max: number],
): number => {
  const hail = input
    .lines()
    .map<[number, number, number, number, number, number]>(
      (line) =>
        new RustIterator(line.matchAll(/-?\d+/g)).map(Number).collect() as [
          number,
          number,
          number,
          number,
          number,
          number,
        ],
    )
    .map((match) => new Hail(...match))
    .collect();

  return range(0, hail.length - 1)
    .flatMap((i) => {
      const hailIter = hail.toIter();
      const first = hailIter.nth(i);
      return hailIter.map(
        (second) => [first, second, first.intersects2D(second)] as const,
      );
    })
    .filter((v) => Boolean(v[2]))
    .filter(
      ([a, b, intersection]) =>
        a.timeToIntersect(intersection) > 0 &&
        b.timeToIntersect(intersection) > 0,
    )
    .filter(
      ([_, __, [x, y]]) =>
        x >= limits[0] && x <= limits[1] && y >= limits[0] && y <= limits[1],
    )
    .count();
};

export const partTwo = (input: AOCInput): number => {
  const hail = input
    .lines()
    .map<[number, number, number, number, number, number]>(
      (line) =>
        new RustIterator(line.matchAll(/-?\d+/g)).map(Number).collect() as [
          number,
          number,
          number,
          number,
          number,
          number,
        ],
    )
    .map((match) => new Hail(...match))
    .collect();
  const [rxv, ryv, rzv]: Vec3 = ['x', 'y', 'z']
    .toIter()
    .map((axis) =>
      hail
        .toIter()
        .map((stone) => [stone[axis], stone[`${axis}v`]] as const)
        .fold(
          (dict, [p, v]) => ((dict[v] ??= []).push(p), dict),
          {} as Record<number, number[]>,
        ),
    )
    .map((velocities) =>
      range(-1000, 1000)
        .filter((pv) =>
          Object.entries(velocities)
            .toIter()
            .map(
              ([v, positions]) =>
                positions.length === 1 ||
                (positions[0] - positions[1]) % (pv - Number(v)) === 0,
            )
            .all(Boolean),
        )
        .nth(0),
    )
    .collect() as Vec3;

  const positions = range(0, hail.length - 1)
    .flatMap((i) => zipLoopFrom(hail, i))
    .map(([a, b]) => {
      const ma = (a.yv - ryv) / (a.xv - rxv);
      const mb = (b.yv - ryv) / (b.xv - rxv);

      const ca = a.y - ma * a.x;
      const cb = b.y - mb * b.x;

      const x = (cb - ca) / (ma - mb);
      const y = ma * x + ca;

      const time = (x - a.x) / (a.xv - rxv);
      const z = a.z + (a.zv - rzv) * time;

      return [x, y, z] as Vec3;
    })
    .map((position) => position.toIter().reduce((a, b) => a + b, 0))
    .filter((score) => score % 1 === 0)
    .fold(
      (positions, score) => (
        (positions[score] = (positions[score] || 0) + 1), positions
      ),
      {} as Record<number, number>,
    );

  return Object.entries(positions)
    .toIter()
    .sort(([_, a], [__, b]) => b - a)
    .map(([k]) => Number(k))
    .nth(0);
};

const zipLoopFrom = <T>(it: Array<T>, pivot: number): RustIterator<[T, T]> => {
  const iter = it.toIter();
  return [iter.nth(pivot)].toIter().cycle().zip(iter);
};

class Hail {
  toString(): string {
    return `\nHail(\n  ${this.x}, ${this.y}, ${this.z}\n  ${this.xv}, ${this.yv}, ${this.zv}\n)\n`;
  }
  constructor(
    public x: number,
    public y: number,
    public z: number,
    public xv: number,
    public yv: number,
    public zv: number,
  ) {}
  get slope2d(): number {
    return this.yv / this.xv;
  }
  get Vec2(): Vec2 {
    return [this.x, this.y];
  }
  get Vec3(): Vec3 {
    return [this.x, this.y, this.z];
  }
  timeToIntersect(position: Vec2): number {
    return (position[0] - this.x) / this.xv;
  }
  intersects2D(other: Hail): Vec2 | null {
    const intersection = find2DIntersection(
      this.Vec2,
      this.slope2d,
      other.Vec2,
      other.slope2d,
    );
    return intersection;
  }
}

type Vec2 = [x: number, y: number];
type Vec3 = [x: number, y: number, z: number];

const find2DIntersection = (
  pointA: Vec2,
  slopeA: number,
  pointB: Vec2,
  slopeB: number,
): Vec2 | null => {
  if (slopeA === slopeB) return null;
  const [x1, y1] = pointA;
  const [x2, y2] = pointB;
  const x = (slopeA * x1 - slopeB * x2 + y2 - y1) / (slopeA - slopeB);
  const y = slopeA * (x - x1) + y1;
  return [x, y];
};

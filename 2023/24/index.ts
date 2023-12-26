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

export const partTwo = (
  _input: AOCInput,
  _limits: [min: number, max: number],
): number => {
  return 0;
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

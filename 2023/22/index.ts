import type { AOCInput } from '../../utils';
import { Vec2, Vec3 } from '../../utils/vec';
import '@ekwoka/rust-ts/prelude';

/**
 * --- Day 22: Sand Slabs ---
 * Got stuck here a while because I assumed that the input
 * had the tetrinos in order on the Z axis
 */
export const partOne = (input: AOCInput): number => {
  const restedTower = input
    .lines()
    .map(
      (line) =>
        new Tetrino(
          ...(line.splitBy('~').map(Vec3.from).collect() as [Vec3, Vec3]),
        ),
    )
    .sort((a, b) => a.start.z - b.start.z)
    .fold((tower, tetrino) => tower.addTetrino(tetrino), new GravityMatrix());
  console.log(restedTower.matrix.toString());
  const required = restedTower.tetrinos
    .iter()
    .map((one) =>
      restedTower.tetrinos
        .toIter()
        .filter((two) => two !== one)
        .filter(one.restingOn.bind(one))
        .collect(),
    )
    .filter((supportedBy) => supportedBy.length === 1)
    .fold((acc, [one]) => acc.add(one), new Set<Tetrino>());
  return restedTower.tetrinos.length - required.size;
};

export const partTwo = (input: AOCInput): number => {
  const restedTower = input
    .lines()
    .map(
      (line) =>
        new Tetrino(
          ...(line.splitBy('~').map(Vec3.from).collect() as [Vec3, Vec3]),
        ),
    )
    .sort((a, b) => a.start.z - b.start.z)
    .fold((tower, tetrino) => tower.addTetrino(tetrino), new GravityMatrix());
  restedTower.tetrinos
    .toIter()
    .map(
      (one) =>
        [
          one,
          restedTower.tetrinos
            .toIter()
            .filter((two) => two !== one)
            .filter(one.restingOn.bind(one))
            .collect(),
        ] as [Tetrino, Tetrino[]],
    )
    .forEach(([one, supportedBy]) => {
      one.supportedBy = supportedBy;
      supportedBy.forEach((two) => two.supports.push(one));
    });
  return restedTower.tetrinos.toIter().map(walkDisintegration).sum();
};

const walkDisintegration = (tetrino: Tetrino): number => {
  const disintegrated = new Set<Tetrino>([tetrino]);
  const queue = tetrino.supports.slice();
  while (queue.length) {
    const next = queue.shift()!;
    if (next.supportedBy.some((t) => !disintegrated.has(t))) continue;
    disintegrated.add(next);
    queue.push(...next.supports.filter((t) => !disintegrated.has(t)));
  }
  return disintegrated.size - 1;
};

class GravityMatrix {
  heightMap: Map<string, number> = new Map();
  tetrinos: Tetrino[] = [];
  matrix: Matrix<Tetrino> = new Matrix();
  getHeight(vec: Vec2): number {
    return this.heightMap.get(vec.toString()) ?? 0;
  }
  setHeight(vec: Vec3): this;
  setHeight(vec: Vec2, height: number): this;
  setHeight(vec: Vec2 | Vec3, height?: number): this {
    if (vec instanceof Vec3) {
      height = vec.z;
      vec = Vec2.from(vec);
    }
    this.heightMap.set(vec.toString(), height as number);
    return this;
  }
  addTetrino(tetrino: Tetrino): this {
    const restingPoint =
      tetrino
        .path()
        .iter()
        .map(Vec2.from)
        .map((vec) => this.getHeight(vec))
        .max()! + 1;
    const fallenTetrino = tetrino.fallTo(restingPoint);
    this.tetrinos.push(fallenTetrino);
    fallenTetrino
      .path()
      .iter()
      .forEach(
        (vec) => (this.setHeight(vec), this.matrix.set(vec, fallenTetrino)),
      );
    return this;
  }
}

class Matrix<T> {
  matrix: T[][][] = [];
  get(vec: Vec3): T {
    return this.matrix[vec.z]?.[vec.y]?.[vec.x];
  }
  set(vec: Vec3, value: T): this {
    ((this.matrix[vec.z] ??= Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => null as T),
    ))[vec.y] ??= [])[vec.x] = value;
    return this;
  }
  toString() {
    return this.matrix
      .map((layer) =>
        layer
          .map((row) => row.map((col) => (col ? 'X' : '.')).join(''))
          .join('\n'),
      )
      .join('\n\n\n');
  }
}
let id = 0;
export class Tetrino {
  id = id++;
  supportedBy: Tetrino[] = [];
  supports: Tetrino[] = [];
  constructor(
    public start: Vec3,
    public end: Vec3,
  ) {}
  path() {
    return this.start.between(this.end);
  }
  fallTo(height: number) {
    const distance = new Vec3(0, 0, this.start.z - height);
    return new Tetrino(this.start.sub(distance), this.end.sub(distance));
  }
  restingOn(other: Tetrino): boolean {
    if (other.end.z !== this.start.z - 1) return false;
    const otherPath = other.path().iter().map(Vec2.from).collect();
    return this.path()
      .iter()
      .map(Vec2.from)
      .any((vec) => otherPath.toIter().any((otherVec) => vec.eq(otherVec)));
  }
  toString() {
    return `${this.start} -> ${this.end}`;
  }
}

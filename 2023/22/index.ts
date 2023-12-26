import { AOCInput } from '../../utils';

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
          ...(line
            .splitBy('~')
            .map(
              (location) =>
                new Vec3(
                  ...(location.splitBy(',').map(Number).collect() as [
                    number,
                    number,
                    number,
                  ]),
                ),
            )
            .collect() as [Vec3, Vec3]),
        ),
    )
    .sort((a, b) => a.start.z - b.start.z)
    .fold((tower, tetrino) => tower.addTetrino(tetrino), new GravityMatrix());
  const required = restedTower.tetrinos
    .toIter()
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
          ...(line
            .splitBy('~')
            .map(
              (location) =>
                new Vec3(
                  ...(location.splitBy(',').map(Number).collect() as [
                    number,
                    number,
                    number,
                  ]),
                ),
            )
            .collect() as [Vec3, Vec3]),
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
  constructor() {}
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
    this.heightMap.set(vec.toString(), height);
    return this;
  }
  addTetrino(tetrino: Tetrino): this {
    const restingPoint =
      tetrino
        .path()
        .toIter()
        .map(Vec2.from)
        .map((vec) => this.getHeight(vec))
        .max() + 1;
    const fallenTetrino = tetrino.fallTo(restingPoint);
    this.tetrinos.push(fallenTetrino);
    fallenTetrino
      .path()
      .forEach(
        (vec) => (this.setHeight(vec), this.matrix.set(vec, fallenTetrino)),
      );
    return this;
  }
}

class Matrix<T> {
  matrix: T[][][] = [];
  constructor() {}
  get(vec: Vec3): T {
    return this.matrix[vec.z]?.[vec.y]?.[vec.x];
  }
  set(vec: Vec3, value: T): this {
    ((this.matrix[vec.z] ??= Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => null),
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
    const otherPath = other.path().toIter().map(Vec2.from).collect();
    return this.path()
      .toIter()
      .map(Vec2.from)
      .any((vec) => otherPath.toIter().any((otherVec) => vec.equals(otherVec)));
  }
  toString() {
    return `${this.start} -> ${this.end}`;
  }
}

class Vec2 {
  constructor(
    public x: number,
    public y: number,
  ) {}
  add(other: Vec2) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }
  sub(other: Vec2) {
    return new Vec2(this.x - other.x, this.y - other.y);
  }
  equals(other: Vec2) {
    return this.x === other.x && this.y === other.y;
  }
  between(other: Vec2) {
    const diff = new Vec2(
      Math.sign(this.x - other.x),
      Math.sign(this.y - other.y),
    );
    const steps = Math.max(
      Math.abs(this.x - other.x),
      Math.abs(this.y - other.y),
    );
    const path: Vec2[] = [this];
    for (let i = 0; i < steps; i++) path.push(path[path.length - 1].add(diff));
    return path;
  }
  toString() {
    return `${this.x},${this.y}`;
  }
  static from(other: Vec3) {
    return new Vec2(other.x, other.y);
  }
}

export class Vec3 {
  constructor(
    public x: number,
    public y: number,
    public z: number,
  ) {}
  add(other: Vec3) {
    return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
  }
  sub(other: Vec3) {
    return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
  }
  equals(other: Vec3) {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }
  between(other: Vec3) {
    const diff = new Vec3(
      Math.sign(other.x - this.x),
      Math.sign(other.y - this.y),
      Math.sign(other.z - this.z),
    );
    const steps = Math.max(
      Math.abs(this.x - other.x),
      Math.abs(this.y - other.y),
      Math.abs(this.z - other.z),
    );
    const path: Vec3[] = [this];
    for (let i = 0; i < steps; i++) path.push(path[path.length - 1].add(diff));
    return path;
  }
  toString() {
    return `${this.x},${this.y},${this.z}`;
  }
}

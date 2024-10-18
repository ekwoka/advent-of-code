import { RustIterator } from '@ekwoka/rust-ts';

interface Vector<N extends number> {
  add(rhs: Vector<N>): Vector<N>;
  sub(rhs: Vector<N>): Vector<N>;
  mult(rhs: Vector<N>): Vector<N>;
  div(rhs: Vector<N>): Vector<N>;

  min(rhs: Vector<N>): Vector<N>;
  max(rhs: Vector<N>): Vector<N>;
  clamp(min: Vector<N>, max: Vector<N>): Vector<N>;

  abs(): Vector<N>;
  ceil(): Vector<N>;
  floor(): Vector<N>;
  round(): Vector<N>;

  scale(scalar: number): Vector<N>;
  dot(rhs: Vector<N>): number;
  length(): number;
  normalize(): Vector<N>;

  projectOnto(rhs: Vector<N>): Vector<N>;
  rejectFrom(rhs: Vector<N>): Vector<N>;

  distance(rhs: Vector<N>): number;
  midPoint(rhs: Vector<N>): Vector<N>;
  moveTowards(rhs: Vector<N>, distance: number): Vector<N>;
  lerp(rhs: Vector<N>, t: number): Vector<N>;

  between(rhs: Vector<N>): IterableIterator<Vector<N>>;
  toArray(): number[];
  toString(): string;
  toIter(): RustIterator<number>;
  toAngle(): number;
}

export class Vec2 implements Vector<2> {
  constructor(
    public x: number,
    public y: number,
  ) {}

  add(rhs: Vec2): Vec2 {
    return new Vec2(this.x + rhs.x, this.y + rhs.y);
  }

  sub(rhs: Vec2): Vec2 {
    return new Vec2(this.x - rhs.x, this.y - rhs.y);
  }

  mult(rhs: Vec2): Vec2 {
    return new Vec2(this.x * rhs.x, this.y * rhs.y);
  }
  div(rhs: Vec2): Vec2 {
    return new Vec2(this.x / rhs.x, this.y / rhs.y);
  }

  min(rhs: Vec2): Vec2 {
    return new Vec2(Math.min(this.x, rhs.x), Math.min(this.y, rhs.y));
  }

  max(rhs: Vec2): Vec2 {
    return new Vec2(Math.max(this.x, rhs.x), Math.max(this.y, rhs.y));
  }

  clamp(min: Vec2, max: Vec2): Vec2 {
    return new Vec2(
      Math.min(max.x, Math.max(min.x, this.x)),
      Math.min(max.y, Math.max(min.y, this.y)),
    );
  }

  abs(): Vec2 {
    return new Vec2(Math.abs(this.x), Math.abs(this.y));
  }

  ceil(): Vec2 {
    return new Vec2(Math.ceil(this.x), Math.ceil(this.y));
  }

  floor(): Vec2 {
    return new Vec2(Math.floor(this.x), Math.floor(this.y));
  }

  round(): Vec2 {
    return new Vec2(Math.round(this.x), Math.round(this.y));
  }

  scale(scalar: number): Vec2 {
    return new Vec2(this.x * scalar, this.y * scalar);
  }

  dot(v: Vec2): number {
    return this.x * v.x + this.y * v.y;
  }

  length(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  normalize(): Vec2 {
    const length = this.length();
    return new Vec2(this.x / length, this.y / length);
  }

  projectOnto(rhs: Vec2): Vec2 {
    const normalized = rhs.normalize();
    return normalized.scale(this.dot(normalized));
  }

  rejectFrom(rhs: Vec2): Vec2 {
    return this.sub(this.projectOnto(rhs));
  }
  distance(rhs: Vec2): number {
    return this.sub(rhs).length();
  }
  midPoint(rhs: Vec2): Vec2 {
    return this.add(rhs).scale(0.5);
  }
  moveTowards(rhs: Vec2, distance: number): Vec2 {
    if (distance === 0) return new Vec2(this.x, this.y);
    if (distance === 100) return new Vec2(rhs.x, rhs.y);
    const diff = rhs.sub(this);
    const length = diff.length();
    const percentage = Math.max(Math.min(100, distance), 0) / 100;
    return this.add(diff.normalize().scale(length * percentage));
  }
  lerp(rhs: Vec2, t: number): Vec2 {
    if (t === 0) return new Vec2(this.x, this.y);
    if (t === 100) return new Vec2(rhs.x, rhs.y);
    const diff = rhs.sub(this);
    const length = diff.length();
    return this.add(diff.normalize().scale((t / 100) * length));
  }

  *between(v: Vec2, inclusive = false): IterableIterator<Vec2> {
    const diff = v.sub(this);
    const length = diff.length();
    const step = diff.scale(1 / length);
    for (let i = 1; i < length; i++) {
      yield this.add(step.scale(i));
    }
    if (inclusive) yield v;
  }

  toArray(): number[] {
    return [this.x, this.y];
  }

  toString(): string {
    return this.toArray().join(',');
  }

  toIter(): RustIterator<number> {
    return new RustIterator(this.toArray());
  }

  toAngle(): number {
    return (Math.atan2(this.y, this.x) * 180) / Math.PI;
  }

  static from(str: string): Vec2;
  static from(iter: Iterable<number>): Vec2;
  static from(iter: Iterable<string>): Vec2;
  static from(v: string | Iterable<string> | Iterable<number>): Vec2 {
    if (typeof v === 'string') {
      const [x, y] = v.split(',').map(Number);
      return new Vec2(x, y);
    }
    const [x, y] = v;
    return new Vec2(Number(x), Number(y));
  }

  static fromAngle(angle: number): Vec2 {
    const rads = (angle * Math.PI) / 180;
    return new Vec2(Math.cos(rads), Math.sin(rads));
  }

  static get ZERO(): Vec2 {
    return new Vec2(0, 0);
  }

  static get ONE(): Vec2 {
    return new Vec2(1, 1);
  }

  static get NEG_ONE(): Vec2 {
    return new Vec2(-1, -1);
  }

  static get MIN(): Vec2 {
    return new Vec2(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
  }

  static get MAX(): Vec2 {
    return new Vec2(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
  }

  static get INFINITY(): Vec2 {
    return new Vec2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
  }

  static get NEG_INFINITY(): Vec2 {
    return new Vec2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
  }

  static get NaN(): Vec2 {
    return new Vec2(Number.NaN, Number.NaN);
  }

  static get X(): Vec2 {
    return new Vec2(1, 0);
  }

  static get Y(): Vec2 {
    return new Vec2(0, 1);
  }

  static get NEG_X(): Vec2 {
    return new Vec2(-1, 0);
  }

  static get NEG_Y(): Vec2 {
    return new Vec2(0, -1);
  }

  static splat(n: number): Vec2 {
    return new Vec2(n, n);
  }

  static select(mask: Vec2, a: Vec2, b: Vec2): Vec2 {
    return new Vec2(mask.x === 1 ? a.x : b.x, mask.y === 1 ? a.y : b.y);
  }

  static add(lhs: Vec2, rhs: Vec2): Vec2 {
    return lhs.add(rhs);
  }
  static sub(lhs: Vec2, rhs: Vec2): Vec2 {
    return lhs.sub(rhs);
  }
  static scale(scalar: number) {
    return (vec: Vec2) => vec.scale(scalar);
  }
  static dot(lhs: Vec2, rhs: Vec2): number {
    return lhs.dot(rhs);
  }
  static length(vec: Vec2): number {
    return vec.length();
  }
  static normalize(vec: Vec2): Vec2 {
    return vec.normalize();
  }
  static clamp(min: Vec2, max: Vec2) {
    return (vec: Vec2) => vec.clamp(min, max);
  }

  static toArray(vec: Vec2): number[] {
    return vec.toArray();
  }
  static toString(vec: Vec2): string {
    return vec.toString();
  }

  static toIter(vec: Vec2): RustIterator<number> {
    return vec.toIter();
  }

  static toAngle(vec: Vec2): number {
    return vec.toAngle();
  }
}

export class Vec3 implements Vector<3> {
  constructor(
    public x: number,
    public y: number,
    public z: number,
  ) {}

  add(v: Vec3): Vec3 {
    return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  sub(v: Vec3): Vec3 {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  scale(scalar: number): Vec3 {
    return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  clamp(min: Vec3, max: Vec3): Vec3 {
    return new Vec3(
      Math.min(max.x, Math.max(min.x, this.x)),
      Math.min(max.y, Math.max(min.y, this.y)),
      Math.min(max.z, Math.max(min.z, this.z)),
    );
  }

  dot(v: Vec3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  length(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  normalize(): Vec3 {
    const length = this.length();
    return new Vec3(this.x / length, this.y / length, this.z / length);
  }
  *between(v: Vec3): IterableIterator<Vec3> {
    const diff = v.sub(this);
    const length = diff.length();
    const step = diff.scale(1 / length);
    for (let i = 1; i < length; i++) {
      yield this.add(step.scale(i));
    }
  }

  toArray(): number[] {
    return [this.x, this.y, this.z];
  }
  toString(): string {
    return this.toArray().join(',');
  }

  toIter(): RustIterator<number> {
    return new RustIterator(this.toArray());
  }

  static from(str: string): Vec3;
  static from(arr: [string | number, string | number, string | number]): Vec3;
  static from(
    v: string | [string | number, string | number, string | number],
  ): Vec3 {
    if (Array.isArray(v))
      return new Vec3(Number(v[0]), Number(v[1]), Number(v[2]));
    const [x, y, z] = v.split(',').map(Number);
    return new Vec3(x, y, z);
  }

  static zero() {
    return new Vec3(0, 0, 0);
  }
}

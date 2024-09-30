interface Vector<N extends number> {
  add(v: Vector<N>): Vector<N>;
  sub(v: Vector<N>): Vector<N>;
  scale(scalar: number): Vector<N>;
  clamp(min: Vector<N>, max: Vector<N>): Vector<N>;
  dot(v: Vector<N>): number;
  length(): number;
  normalize(): Vector<N>;
  between(v: Vector<N>): IterableIterator<Vector<N>>;
  toArray(): number[];
  toString(): string;
}

export class Vec2 implements Vector<2> {
  constructor(
    public x: number,
    public y: number,
  ) {}

  add(v: Vec2): Vec2 {
    return new Vec2(this.x + v.x, this.y + v.y);
  }

  sub(v: Vec2): Vec2 {
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  scale(scalar: number): Vec2 {
    return new Vec2(this.x * scalar, this.y * scalar);
  }

  clamp(min: Vec2, max: Vec2): Vec2 {
    return new Vec2(
      Math.min(max.x, Math.max(min.x, this.x)),
      Math.min(max.y, Math.max(min.y, this.y)),
    );
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

  static from(str: string): Vec2;
  static from(arr: [string | number, string | number]): Vec2;
  static from(v: string | [string | number, string | number]): Vec2 {
    if (Array.isArray(v)) return new Vec2(Number(v[0]), Number(v[1]));
    const [x, y] = v.split(',').map(Number);
    return new Vec2(x, y);
  }

  static zero(): Vec2 {
    return new Vec2(0, 0);
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
  static clamp(min: Vec2, max: Vec2) {
    return (vec: Vec2) => vec.clamp(min, max);
  }
  static length(vec: Vec2): number {
    return vec.length();
  }
  static normalize(vec: Vec2): Vec2 {
    return vec.normalize();
  }

  static toArray(vec: Vec2): number[] {
    return vec.toArray();
  }
  static toString(vec: Vec2): string {
    return vec.toString();
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

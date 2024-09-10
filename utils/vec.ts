interface Vector<N extends number> {
  add(v: Vector<N>): Vector<N>;
  sub(v: Vector<N>): Vector<N>;
  scale(scalar: number): Vector<N>;
  dot(v: Vector<N>): number;
  length(): number;
  normalize(): Vector<N>;
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

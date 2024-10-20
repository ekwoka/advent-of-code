import '@ekwoka/rust-ts/prelude';
import type { AOCInput } from '../../utils';
import { Vec2 } from '../../utils/vec';

class Light {
  constructor(
    public on: boolean,
    public location: Vec2 = Vec2.ZERO,
  ) {}

  update(neighborStates: number) {
    this.on = this.on
      ? neighborStates === 2 || neighborStates === 3
      : neighborStates === 3;
  }

  break() {
    return new BrokenLight(this.on, this.location);
  }

  static from(char: string) {
    return new Light(char === '#');
  }
}

class BrokenLight implements Light {
  on = true;
  constructor(
    _: boolean,
    public location: Vec2 = Vec2.ZERO,
  ) {}
  update() {}
  break() {
    return this;
  }
  static from() {
    return new BrokenLight(true);
  }
}

const offsets = [
  Vec2.ONE,
  Vec2.NEG_ONE,
  Vec2.X,
  Vec2.Y,
  Vec2.NEG_X,
  Vec2.NEG_Y,
  Vec2.Y.add(Vec2.NEG_X),
  Vec2.X.add(Vec2.NEG_Y),
];

class LightGrid {
  constructor(public lights: Light[][]) {}

  public step() {
    const neighborCounts = this.lights.map((row) =>
      new Array(row.length).fill(0),
    );
    this.lights
      .iter()
      .flatMap((row) => row.iter())
      .filter((light) => light.on)
      .forEach((light) =>
        offsets
          .map((offset) => light.location.add(offset))
          .filter(
            (coord) =>
              coord.x >= 0 &&
              coord.x < this.lights[0].length &&
              coord.y >= 0 &&
              coord.y < this.lights.length,
          )
          .forEach((coord) => neighborCounts[coord.y][coord.x]++),
      );
    this.lights
      .iter()
      .flatMap((row) => row.iter())
      .forEach((light) =>
        light.update(neighborCounts[light.location.y][light.location.x]),
      );
  }

  public count() {
    return this.lights
      .iter()
      .flatMap((row) => row.iter())
      .filter((light) => light.on)
      .count();
  }

  public log() {
    console.log('\n');
    console.log(
      this.lights
        .map((row) => row.map((light) => (light.on ? '#' : '.')).join(''))
        .join('\n'),
    );
  }

  static From(input: AOCInput) {
    return new LightGrid(
      input
        .lines()
        .enumerate()
        .map(([y, line]) =>
          line
            .chars()
            .enumerate()
            .map(([x, char]) => new Light(char === '#', new Vec2(x, y)))
            .collect(),
        )
        .collect(),
    );
  }
}
export const partOne = (input: AOCInput, steps = 100) => {
  const lights = LightGrid.From(input);
  for (let i = 0; i < steps; i++) lights.step();
  return lights.count();
};
export const partTwo = (input: AOCInput, steps = 100) => {
  const lights = LightGrid.From(input);
  [0, lights.lights.length - 1].forEach((y) =>
    [0, lights.lights[0].length - 1].map(
      (x) => (lights.lights[y][x] = lights.lights[y][x].break()),
    ),
  );
  for (let i = 0; i < steps; i++) lights.step();
  return lights.count();
};

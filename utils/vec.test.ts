import { Vec2 } from './vec';
describe('Vec2', () => {
  describe('static methods', () => {
    it.each([
      ['5,7', 5, 7],
      [[42, 69], 42, 69],
      [['7', '8'], 7, 8],
      [
        {
          'this is': 'an iterable',
          [Symbol.iterator]: () => [11, 12][Symbol.iterator](),
        },
        11,
        12,
      ],
    ])('Vec2.from(%o) is a Vec2(%d, %d)', (input, x, y) => {
      expect(Vec2.from(input as string)).toEqual(new Vec2(x, y));
    });
    it('Vec2.fromAngle', () => {
      expect(toFixed(Vec2.fromAngle(30), 3)).toEqual(new Vec2(0.866, 0.5));
    });
    it.each([
      ['ZERO', 0, 0],
      ['ONE', 1, 1],
      ['NEG_ONE', -1, -1],
      ['MIN', Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
      ['MAX', Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
      ['INFINITY', Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
      ['NEG_INFINITY', Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
      ['NaN', Number.NaN, Number.NaN],
      ['X', 1, 0],
      ['Y', 0, 1],
      ['NEG_X', -1, 0],
      ['NEG_Y', 0, -1],
    ] as const)('Vec2.%s is a Vec2 with %d, %d', (method, x, y) => {
      expect(Vec2[method as keyof Vec2]).toEqual(new Vec2(x, y));
    });

    it.each([(Math.random() * 200) | 0])(
      'splat %d as n to Vec2(n, n))',
      (n) => {
        expect(Vec2.splat(n)).toEqual(new Vec2(n, n));
      },
    );

    it('Selects new Vec2 from multiple Vecs with Mask', () => {
      expect(Vec2.select(Vec2.Y, Vec2.splat(55), Vec2.splat(99))).toEqual(
        new Vec2(99, 55),
      );
    });
  });
  describe('instance methods', () => {
    describe('Math operations', () => {
      it('Vec2#add', () => {
        expect(Vec2.X.add(Vec2.Y)).toEqual(Vec2.ONE);
      });
      it('Vec2#sub', () => {
        expect(Vec2.ONE.sub(Vec2.Y)).toEqual(Vec2.X);
      });
      it('Vec2#mult', () => {
        expect(Vec2.NEG_ONE.mult(Vec2.Y)).toEqual(new Vec2(-0, -1));
      });
      it('Vec2#div', () => {
        expect(Vec2.splat(42).div(new Vec2(6, 2))).toEqual(new Vec2(7, 21));
      });
      it('Vec2#min', () => {
        expect(Vec2.splat(42).min(new Vec2(69, 32))).toEqual(new Vec2(42, 32));
      });
      it('Vec2#max', () => {
        expect(Vec2.splat(42).max(new Vec2(69, 32))).toEqual(new Vec2(69, 42));
      });
      it('Vec2#clamp', () => {
        expect(new Vec2(42, 69).clamp(Vec2.ZERO, Vec2.splat(50))).toEqual(
          new Vec2(42, 50),
        );
      });
      it('Vec2#abs', () => {
        expect(new Vec2(-42, 69).abs()).toEqual(new Vec2(42, 69));
      });
      it('Vec2#ceil', () => {
        expect(new Vec2(42.1, 69.9).ceil()).toEqual(new Vec2(43, 70));
      });
      it('Vec2#floor', () => {
        expect(new Vec2(42.1, 69.9).floor()).toEqual(new Vec2(42, 69));
      });
      it('Vec2#round', () => {
        expect(new Vec2(42.1, 69.9).round()).toEqual(new Vec2(42, 70));
      });
    });
    describe('Vector operations', () => {
      it('Vec2#scale', () => {
        expect(Vec2.ONE.scale(5)).toEqual(Vec2.splat(5));
      });
      it('Vec2#dot', () => {
        expect(Vec2.splat(2).dot(Vec2.splat(5))).toBe(20);
      });
      it('Vec2#length', () => {
        expect(new Vec2(42, 69).length()).toBeCloseTo(80.777);
      });
      it('Vec2#normalize', () => {
        expect(new Vec2(42, 69).normalize()).toEqual(
          new Vec2(0.5199469468957453, 0.8541985556144386),
        );
        expect(new Vec2(42, 69).normalize().length()).toBeCloseTo(1);
      });
      it('Vec2#projectOnto', () => {
        expect(
          toFixed(new Vec2(4, 7).projectOnto(Vec2.fromAngle(30)), 3),
        ).toEqual(new Vec2(6.031, 3.482));
      });
      it('Vec2#rejectFrom', () => {
        expect(
          toFixed(new Vec2(4, 7).rejectFrom(Vec2.fromAngle(30)), 3),
        ).toEqual(new Vec2(-2.031, 3.518));
      });
      it('Vec2#distance', () => {
        expect(Number(new Vec2(3, 4).distance(Vec2.NEG_X).toFixed(3))).toBe(
          5.657,
        );
      });
      it('Vec2#midPoint', () => {
        expect(new Vec2(39, 60).midPoint(new Vec2(45, 78))).toEqual(
          new Vec2(42, 69),
        );
      });
      it('Vec2#moveTowards', () => {
        expect(new Vec2(50, 100).moveTowards(Vec2.ZERO, 10)).toEqual(
          new Vec2(45, 90),
        );
        expect(new Vec2(50, 100).moveTowards(Vec2.ZERO, 110)).toEqual(
          Vec2.ZERO,
        );
        expect(new Vec2(50, 100).moveTowards(Vec2.ZERO, -10)).toEqual(
          new Vec2(50, 100),
        );
      });
      it('Vec2#lerp', () => {
        expect(new Vec2(50, 100).lerp(Vec2.ZERO, 10)).toEqual(new Vec2(45, 90));
        expect(new Vec2(50, 100).lerp(Vec2.ZERO, 110)).toEqual(
          new Vec2(-5, -10),
        );
        expect(new Vec2(50, 100).lerp(Vec2.ZERO, -10)).toEqual(
          new Vec2(55, 110),
        );
      });
    });
    describe('Vec2#to*', () => {
      it('Array', () => {
        expect(Vec2.X.toArray()).toEqual([1, 0]);
      });
      it('String', () => {
        expect(Vec2.X.toString()).toEqual('1,0');
      });
      it('Iter', () => {
        expect([...Vec2.X.toIter()]).toEqual([1, 0]);
      });
      it('Angle', () => {
        expect(Vec2.X.toAngle()).toBeCloseTo(0);
        expect(Vec2.fromAngle(30).toAngle()).toBeCloseTo(30);
      });
    });
  });

  describe('Trait calling methods', () => {
    describe('Math operations', () => {
      it('Vec2#add', () => {
        expect(Vec2.add(Vec2.X, Vec2.Y)).toEqual(Vec2.ONE);
      });
      it('Vec2#sub', () => {
        expect(Vec2.sub(Vec2.ONE, Vec2.Y)).toEqual(Vec2.X);
      });
    });
    describe('Vector operations', () => {
      it('Vec2#scale', () => {
        expect(Vec2.scale(5)(Vec2.ONE)).toEqual(Vec2.splat(5));
      });
      it('Vec2#dot', () => {
        expect(Vec2.dot(Vec2.splat(2), Vec2.splat(5))).toBe(20);
      });
      it('Vec2#length', () => {
        expect(Vec2.length(new Vec2(42, 69))).toBeCloseTo(80.777);
      });
      it('Vec2#normalize', () => {
        expect(Vec2.normalize(new Vec2(42, 69))).toEqual(
          new Vec2(0.5199469468957453, 0.8541985556144386),
        );
        expect(Vec2.normalize(new Vec2(42, 69)).length()).toBeCloseTo(1);
      });
      it('Vec2#clamp', () => {
        expect(Vec2.clamp(Vec2.ZERO, Vec2.splat(50))(new Vec2(42, 69))).toEqual(
          new Vec2(42, 50),
        );
      });
    });
    describe('Vec2#to*', () => {
      it('Array', () => {
        expect(Vec2.toArray(Vec2.X)).toEqual([1, 0]);
      });
      it('String', () => {
        expect(Vec2.toString(Vec2.X)).toEqual('1,0');
      });
      it('Iter', () => {
        expect([...Vec2.toIter(Vec2.X)]).toEqual([1, 0]);
      });
      it('Angle', () => {
        expect(Vec2.toAngle(Vec2.X)).toBeCloseTo(0);
        expect(Vec2.toAngle(Vec2.fromAngle(30))).toBeCloseTo(30);
      });
    });
  });

  describe('vector projection', () => {
    it('projects a vector onto another vector', () => {
      const angle = 30;
      const rads = (angle * Math.PI) / 180;
      const wallVec = new Vec2(Math.cos(rads), Math.sin(rads));
      const projectedVec = wallVec.scale(new Vec2(4, 7).dot(wallVec));
      expect(
        new Vec2(
          Number(projectedVec.x.toFixed(3)),
          Number(projectedVec.y.toFixed(3)),
        ),
      ).toEqual(new Vec2(6.031, 3.482));
    });
    it('projects again', () => {
      const onto = new Vec2(2, 8).normalize();
      const from = new Vec2(4, 3);
      const projected = onto.scale(from.dot(onto));
      expect(projected).toEqual(new Vec2(16 / 17, 64 / 17));
    });
  });
});

const toFixed = (vec: Vec2, n: number) =>
  new Vec2(Number(vec.x.toFixed(n)), Number(vec.y.toFixed(n)));

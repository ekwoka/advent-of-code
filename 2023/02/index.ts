/**
 * Going to try to tackle this day in just the Type System
 * No "runtime" javascript, just Types
 * I will use the test cases only, as the large input
 * may be passed type recursion limits
 */

type Input =
  'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green\nGame 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue\nGame 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red\nGame 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red\nGame 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green';

type Color = 'red' | 'green' | 'blue';

type PartOne<T extends string> = Sum<
  FilterOverLimitAndMapToID<MapLinesToGame<SeparateGames<T>>>
>;

type SeparateGames<T extends string> = Split<T, '\n'>;

type MapLinesToGame<T extends string[]> = T extends [
  infer A extends string,
  ...infer B extends string[],
]
  ? [CreateGame<A>, ...MapLinesToGame<B>]
  : [];

type CreateGame<T extends string> = T extends `Game ${infer A extends
  number}: ${infer B extends `${number} ${Color}${string}`}`
  ? AssignMax<
      {
        id: A;
        red: 0;
        green: 0;
        blue: 0;
      },
      DrawsToColorCombos<Split<B, ',' | ';'>>
    >
  : never;

type Limit = {
  id: 0;
  red: 12;
  green: 13;
  blue: 14;
};

type FilterOverLimitAndMapToID<A extends Game[]> = A extends [
  infer G extends Game,
  ...infer Rest extends Game[],
]
  ? GreaterThan<G[Color], Limit[Color]> extends false
    ? [G['id'], ...FilterOverLimitAndMapToID<Rest>]
    : FilterOverLimitAndMapToID<Rest>
  : [];

type DrawsToColorCombos<T extends string[]> = T extends [
  infer A extends string,
  ...infer B extends string[],
]
  ? [InferColorCount<A>, ...DrawsToColorCombos<B>]
  : [];

type InferColorCount<S extends string> = TrimLeft<S> extends `${infer N extends
  number} ${infer C}`
  ? [N, C]
  : [];

type AssignMax<G extends Game, E extends [number, Color][]> = E extends [
  infer A extends [number, Color],
  ...infer Rest extends [number, Color][],
]
  ? AssignMax<InnerAssignMax<G, A>, Rest>
  : G;

type InnerAssignMax<
  G extends Game,
  E extends readonly [number, Color],
> = E extends [infer N extends number, infer C extends Color]
  ? { [K in keyof Game]: K extends C ? Max<G[K], N> : G[K] }
  : never;

type Game = {
  id: number;
  red: number;
  green: number;
  blue: number;
};

type PartOneResult = PartOne<Input>;

type _P1Check = Assert<EQ<PartOneResult, 8>>;

/* fn part_one_test(contents: &str) {
    let outcome = part_one(contents);
    assert!(outcome == 8);
}
fn part_two_test(contents: &str) {
    let outcome = part_two(contents);
    assert!(outcome == 2286);
} */

/**
 * Some Utility Types
 */
type Assert<T extends true> = T;
type EQ<A, B> = A extends B ? (B extends A ? true : false) : false;

type Split<
  S extends string,
  D extends string,
  Current extends string = '',
> = S extends ''
  ? Current extends ''
    ? []
    : [Current]
  : S extends `${infer T}${infer U}`
    ? T extends D
      ? Current extends ''
        ? Split<U, D>
        : [Current, ...Split<U, D>]
      : Split<U, D, `${Current}${T}`>
    : [Current];

type SplitAll<S extends string> = S extends `${infer T}${infer U}`
  ? [T, ...SplitAll<U>]
  : [];

type Join<T extends string[], D extends string = ''> = T extends [
  infer A extends string,
  ...infer B extends string[],
]
  ? B extends []
    ? A
    : `${A}${D}${Join<B, D>}`
  : '';

type ToRemove = ' ' | ',' | ';' | '0';

type TrimLeft<S extends string> = S extends `${infer P}${infer T}`
  ? P extends ToRemove
    ? TrimLeft<T>
    : S
  : S;

type Inc = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type Dec = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8];

type WrapInc<N extends number[]> = RemoveLeadingZeros<
  [0, ...N] extends [...infer Left extends number[], infer A extends number]
    ? Inc[A] extends 10
      ? [...WrapInc<Left>, 0]
      : [...Left, Inc[A]]
    : [Inc[N[0]]]
>;

type WrapDec<N extends number[]> = RemoveLeadingZeros<
  N extends [...infer Left extends number[], infer A extends number]
    ? Dec[A] extends -1
      ? [...WrapDec<[0, ...Left]>, 9]
      : [...Left, Dec[A]]
    : [Dec[N[0]]]
>;

type WrapAdd<
  LHS extends number[],
  RHS extends number[],
> = AllZeroes<RHS> extends true ? LHS : WrapAdd<WrapInc<LHS>, WrapDec<RHS>>;

type AllZeroes<T extends number[]> = T extends [0, ...infer B extends number[]]
  ? AllZeroes<B>
  : T extends []
    ? true
    : false;

type RemoveLeadingZeros<T extends number[]> = T extends [
  0,
  ...infer B extends number[],
]
  ? RemoveLeadingZeros<B>
  : T;

type Add<LHS extends number, RHS extends number> = ToNumber<
  Join<MapToStrings<WrapAdd<ExplodeNumber<LHS>, ExplodeNumber<RHS>>>>
>;

type MapToNumbers<T extends string[]> = T extends [
  infer A extends `${number}`,
  ...infer B extends string[],
]
  ? A extends `${infer AN extends number}`
    ? [AN, ...MapToNumbers<B>]
    : MapToNumbers<B>
  : [];

type MapToStrings<T extends number[]> = T extends [
  infer A extends number,
  ...infer B extends number[],
]
  ? [`${A}`, ...MapToStrings<B>]
  : [];

type Max<LHS extends number, RHS extends number> = LessThan<
  LHS,
  RHS
> extends true
  ? RHS
  : LHS;

type GreaterThan<LHS extends number, RHS extends number> = EQ<
  LHS,
  RHS
> extends true
  ? false
  : LessThan<LHS, RHS> extends true
    ? false
    : true;

type LessThan<LHS extends number, RHS extends number> = EQ<
  LHS,
  RHS
> extends true
  ? false
  : LengthLessThan<LHS, RHS> extends true
    ? true
    : LengthLessThan<RHS, LHS> extends true
      ? false
      : LessThanMap<ExplodeNumber<LHS>, ExplodeNumber<RHS>>;

type ExplodeNumber<T extends number> = MapToNumbers<SplitAll<`${T}`>>;

type ToNumber<S extends string> = S extends `${infer N extends number}`
  ? N
  : never;
type LengthLessThan<LHS extends number, RHS extends number> = LessThan<
  Len<ExplodeNumber<LHS>>,
  Len<ExplodeNumber<RHS>>
> extends true
  ? true
  : false;

type LessThanMap<LHS extends number[], RHS extends number[]> = LHS extends [
  infer A extends number,
  ...infer B extends number[],
]
  ? RHS extends [infer C extends number, ...infer D extends number[]]
    ? SingleDigitLessThan<A, C> extends true
      ? true
      : LessThanMap<B, D>
    : false
  : false;

type SingleDigitLessThan<LHS extends number, RHS extends number> = EQ<
  LHS,
  RHS
> extends true
  ? false
  : LHS extends 0
    ? true
    : RHS extends 0
      ? false
      : SingleDigitLessThan<Dec[LHS], Dec[RHS]>;

type Len<A extends unknown[]> = A['length'];

type Sum<T extends number[]> = T extends [
  infer A extends number,
  ...infer B extends number[],
]
  ? Add<A, Sum<B>>
  : 0;

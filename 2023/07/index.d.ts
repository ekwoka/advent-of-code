// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Add, EQ, Mult, Sum } from './math';
import { Split, SplitAll, ToNumber } from './transform';
import { LessThan } from './compare';

type Input = '32T3K 65\nT55J5 84\nKK677 28\nKTJJT 20\nQQQJA 83\n';
export enum HandTypes {
  HighCard = 0,
  Pair = 1,
  TwoPair = 2,
  ThreeOfAKind = 3,
  FullHouse = 4,
  FourOfAKind = 5,
  FiveOfAKind = 6,
}
type partOneCards = 'TJQKA';
type PartOne<T extends string> = Sum<
  CalculateScore<SortHands<MapHands<Lines<T>>>>
>;

// The Result of course
type PartOneResult = PartOne<Input>;

// Asserts that the result is the expected 8
type _P1IsCorrect = Assert<EQ<PartOneResult, 933>>;
type Assert<T extends true> = T;

type CalculateScore<
  T extends [string, HandTypes, number][],
  count extends number = 1,
> = T extends [
  infer A extends [string, HandTypes, number],
  ...infer Rest extends [string, HandTypes, number][],
]
  ? [Mult<A[2], count>, ...CalculateScore<Rest, Add<count, 1>>]
  : [];

type SortHands<
  T extends [string, HandTypes, number][],
  Carry extends [string, HandTypes, number][] = [],
  Max extends [string, HandTypes, number] | undefined = undefined,
> = T extends [
  infer A extends [string, HandTypes, number],
  ...infer B extends [string, HandTypes, number][],
]
  ? Max extends [string, HandTypes, number]
    ? EQ<Max[1], A[1]> extends false
      ? LessThan<Max[1], A[1]> extends false
        ? SortHands<B, SortHands<[...Carry, A]>, Max>
        : SortHands<B, SortHands<[...Carry, Max]>, A>
      : IsLesserHand<Max[0], A[0]> extends true
        ? SortHands<B, SortHands<[...Carry, A]>, Max>
        : SortHands<B, SortHands<[...Carry, Max]>, A>
    : SortHands<B, Carry, A>
  : Max extends [string, HandTypes, number]
    ? [...Carry, Max]
    : [];

type MapHands<T extends string[]> = T extends [
  infer A extends string,
  ...infer B extends string[],
]
  ? [LineToHand<Split<A, ' '>>, ...MapHands<B>]
  : [];

type CardToNumber<T extends string> = T extends `${infer N extends number}`
  ? N
  : T extends `${infer C extends partOneCards[number]}`
    ? Add<10, IndexOf<partOneCards, C>>
    : never;

type IndexOf<
  T extends string,
  C extends T[number],
> = T extends `${infer A}${infer B}`
  ? A extends C
    ? 0
    : Add<1, IndexOf<B, C>>
  : 0;

type Lines<Input extends string> = Split<Input, '\n'>;

type LineToHand<T extends string[]> = T extends [
  infer Hand extends string,
  infer Bid extends string,
]
  ? [Hand, HandToType<Hand>, ToNumber<Bid>]
  : never;

type UniqueToType = [
  never,
  HandTypes.FiveOfAKind,
  never,
  never,
  HandTypes.Pair,
  HandTypes.HighCard,
];

type HandToType<T extends string> = CountUnique<
  SplitAll<T>
> extends infer U extends number
  ? UniqueToType[U] extends never
    ? SortUniques<SplitAll<T>> extends [
        infer _,
        infer B extends [string, number],
        ...infer _Rest,
      ]
      ? B extends [infer _, infer C2]
        ? U extends 3
          ? C2 extends 1
            ? HandTypes.ThreeOfAKind
            : HandTypes.TwoPair
          : U extends 2
            ? C2 extends 1
              ? HandTypes.FourOfAKind
              : HandTypes.FullHouse
            : never
        : never
      : never
    : UniqueToType[U]
  : never;

type SortUniques<T extends string[]> = Sort<CountAll<T, GetUniques<T>>>;

type CountAll<S extends string[], T extends string[]> = T extends [
  infer A extends string,
  ...infer B extends string[],
]
  ? [[A, Count<S, A>], ...CountAll<S, B>]
  : [];

type GetUniques<T extends string[]> = T extends [
  infer A,
  ...infer B extends string[],
]
  ? A extends B[number]
    ? GetUniques<B>
    : [A, ...GetUniques<B>]
  : [];

type Count<T extends string[], C extends string> = T extends [
  infer A,
  ...infer B extends string[],
]
  ? A extends C
    ? Add<1, Count<B, C>>
    : Count<B, C>
  : 0;

type Sort<
  T extends [string, number][],
  Carry extends [string, number][] = [],
  Max extends [string, number] | undefined = undefined,
> = T extends [
  infer A extends [string, number],
  ...infer B extends [string, number][],
]
  ? Max extends [string, number]
    ? LessThan<Max[1], A[1]> extends false
      ? Sort<B, Sort<[A, ...Carry]>, Max>
      : Sort<B, Sort<[Max, ...Carry]>, A>
    : Sort<B, Carry, A>
  : Max extends [string, number]
    ? [Max, ...Carry]
    : [];

type CountUnique<T extends string[]> = T extends [
  infer A,
  ...infer B extends string[],
]
  ? A extends B[number]
    ? CountUnique<B>
    : Add<1, CountUnique<B>>
  : 0;

type IsLesserHand<LHS extends string, RHS extends string> = CompareCards<
  SplitAll<LHS>,
  SplitAll<RHS>
>;

type CompareCards<LHS extends string[], RHS extends string[]> = LHS extends [
  infer L extends string,
  ...infer LR extends string[],
]
  ? RHS extends [infer R extends string, ...infer RR extends string[]]
    ? EQ<L, R> extends true
      ? CompareCards<LR, RR>
      : LessThan<CardToNumber<L>, CardToNumber<R>>
    : false
  : false;

import { ExplodeNumber, Join, MapToStrings, ToNumber } from './transform';

/**
 * Is Equal. Works for non-numbers as well
 */
export type EQ<A, B> = A extends B ? (B extends A ? true : false) : false;

/**
 * Increments a single digit by one
 * Inc[2] => 3
 */
export type Inc = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * Decrements a single digit by one
 * Dec[2] => 1
 */
export type Dec = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8];

/**
 * Handles multi digit incrementation, needed for larger Math
 * Operates on a number[] and increments the right most digit by one
 * If the number is over 10, it will set it to 0 and increment the next rightmost digit
 * WrapInc<[1, 2, 9]> => [1, 3, 0]
 */
type WrapInc<N extends number[]> = RemoveLeadingZeros<
  [0, ...N] extends [...infer Left extends number[], infer A extends number]
    ? Inc[A] extends 10
      ? [...WrapInc<Left>, 0]
      : [...Left, Inc[A]]
    : [Inc[N[0]]]
>;

/**
 * Handles multi digit decrementation, needed for larger Math
 * WrapDec<[1, 2, 0]> => [1, 1, 9]
 */
type WrapDec<N extends number[]> = RemoveLeadingZeros<
  N extends [...infer Left extends number[], infer A extends number]
    ? Dec[A] extends -1
      ? [...WrapDec<[0, ...Left]>, 9]
      : [...Left, Dec[A]]
    : [Dec[N[0]]]
>;

/**
 * Multi digit addition
 * operates on number[] and recursively increments the LHS and decrements the RHS
 * until the RHS is zero
 */
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

/**
 * Adds two multi digit numbers together
 * This types wraps the "wrapAdd" and handles converting the number to number[] to perform the math
 * and then converting back to number
 */
export type Add<LHS extends number, RHS extends number> = ToNumber<
  Join<MapToStrings<WrapAdd<ExplodeNumber<LHS>, ExplodeNumber<RHS>>>>
>;

/**
 * Sums a number[] to a single number
 */
export type Sum<T extends number[]> = T extends [
  infer A extends number,
  ...infer B extends number[],
]
  ? Add<A, Sum<B>>
  : 0;

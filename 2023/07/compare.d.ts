import type { Dec, EQ } from './math';
import type { ExplodeNumber } from './transform';

export type Max<LHS extends number, RHS extends number> = LessThan<
  LHS,
  RHS
> extends true
  ? RHS
  : LHS;

export type GreaterThan<LHS extends number, RHS extends number> = EQ<
  LHS,
  RHS
> extends true
  ? false
  : LessThan<LHS, RHS> extends true
    ? false
    : true;

export type LessThan<LHS extends number, RHS extends number> = EQ<
  LHS,
  RHS
> extends true
  ? false
  : LengthLessThan<LHS, RHS> extends true
    ? true
    : LengthLessThan<RHS, LHS> extends true
      ? false
      : LessThanMap<ExplodeNumber<LHS>, ExplodeNumber<RHS>>;

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

import '@ekwoka/rust-ts/prelude';
import { range } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';

class Ingredient {
  constructor(
    public capacity: number,
    public durability: number,
    public flavor: number,
    public texture: number,
    public calorie: number,
    public used = 0,
  ) {}

  static From(input: string | string) {
    return new Ingredient(
      ...([...input.matchAll(/-?\d+/g)].map(Number) as [
        number,
        number,
        number,
        number,
        number,
      ]),
    );
  }
}

class Recipe {
  constructor(
    public capacity = 0,
    public durability = 0,
    public flavor = 0,
    public texture = 0,
    public calorie = 0,
    public size = 0,
  ) {}

  public add(ingredient: Ingredient, amount: number) {
    this.capacity += ingredient.capacity * amount;
    this.durability += ingredient.durability * amount;
    this.flavor += ingredient.flavor * amount;
    this.texture += ingredient.texture * amount;
    this.calorie += ingredient.calorie * amount;
    this.size += amount;
  }

  public with(ingredient: Ingredient, amount: number) {
    const copy = new Recipe(
      this.capacity,
      this.durability,
      this.flavor,
      this.texture,
      this.calorie,
      this.size,
    );
    copy.add(ingredient, amount);
    return copy;
  }

  public get remainingSpace() {
    return 100 - this.size;
  }

  public get lowestAttr() {
    return Object.getOwnPropertyNames(this)
      .map((attr) => [attr, this[attr]] as [string, number])
      .sort((a, b) => a[1] - b[1])[0][0];
  }

  public calculateScore() {
    return (
      Math.max(0, this.capacity) *
      Math.max(0, this.durability) *
      Math.max(0, this.flavor) *
      Math.max(0, this.texture)
    );
  }
}

export const partOne = (input: AOCInput) => {
  let iter = [new Recipe()].iter();
  input
    .lines()
    .filter(Boolean)
    .map(Ingredient.From)
    .forEach(
      (ingredient) =>
        (iter = iter.flatMap((recipe) =>
          range(0, recipe.remainingSpace).map((amount) =>
            recipe.with(ingredient, amount),
          ),
        )),
    );
  return iter.map((recipe) => recipe.calculateScore()).max();
};
export const partTwo = (input: AOCInput) => {
  let iter = [new Recipe()].iter();
  input
    .lines()
    .filter(Boolean)
    .map(Ingredient.From)
    .forEach(
      (ingredient) =>
        (iter = iter.flatMap((recipe) =>
          range(0, recipe.remainingSpace).map((amount) =>
            recipe.with(ingredient, amount),
          ),
        )),
    );
  return iter
    .filter((recipe) => recipe.calorie === 500)
    .filter((recipe) => recipe.size === 100)
    .map((recipe) => recipe.calculateScore())
    .max();
};

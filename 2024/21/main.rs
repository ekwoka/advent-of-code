//! ```cargo
//! [dependencies]
//! ```
#![feature(test, let_chains)]

#[path = "../../utils/main.rs"]
mod utils;

use utils::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}

#[derive(PartialEq)]
enum Action {
  Activate,
  Up,
  Down,
  Left,
  Right
}

impl Action {
  const ALL: [Action; 5] = [Action::Up, Action::Down, Action::Left, Action::Right, Action::Activate];
}

struct NumericPad {
  position: Vec2
}

impl NumericPad {
  fn new() -> Self {
    Self {
      position: Vec2::new(2, 0)
    }
  }
  fn goto(&mut self, target: char) -> Vec<char> {
    let dest = match target {
      '0' => Vec2::new(1, 0),
      'A' => Vec2::new(2, 0),
      '1' => Vec2::new(0, 1),
      '2' => Vec2::new(1, 1),
      '3' => Vec2::new(2, 1),
      '4' => Vec2::new(0, 2),
      '5' => Vec2::new(1, 2),
      '6' => Vec2::new(2, 2),
      '7' => Vec2::new(0, 3),
      '8' => Vec2::new(1, 3),
      '9' => Vec2::new(2, 3),
      _ => todo!()
    };
    let diff = dest - self.position;

    let mut output: Vec<char> = vec![];
    if (dest.x > 0 || self.position.y > 0) && diff.x < 0 {
      for _ in 0..diff.x.abs() {
        output.push('<');
      }
    }
    if diff.y < 0 {
      for _ in 0..diff.y.abs() {
        output.push('v');
      }
    }
        if diff.y > 0 {
      for _ in 0..diff.y {
        output.push('^');
      }
    }
    if diff.x > 0 {
      for _ in 0..diff.x {
        output.push('>');
      }
    }
    if dest.x == 0 && self.position.y == 0 && diff.x < 0 {
      for _ in 0..diff.x.abs() {
        output.push('<');
      }
    }
    self.position = dest;
    output.push('A');
    output
  }
}

struct DirectionalPad {
  position: Vec2
}

impl DirectionalPad {
  fn new() -> Self {
    Self {
      position: Vec2::new(2, 1)
    }
  }
  fn goto(&mut self, target: char) -> Vec<char> {
    let dest = match target {
      '<' => Vec2::new(0, 0),
      'v' => Vec2::new(1, 0),
      '>' => Vec2::new(2, 0),
      '^' => Vec2::new(1, 1),
      'A' => Vec2::new(2, 1),
      _ => todo!()
    };
    let diff = dest - self.position;

    let mut output: Vec<char> = vec![];

    if dest.x != 0 && diff.x < 0 {
      for _ in 0..diff.x.abs() {
        output.push('<');
      }
    }
    if self.position.x != 0 && diff.y > 0 {
      for _ in 0..diff.y {
        output.push('^');
      }
    }
    if diff.x > 0 {
      for _ in 0..diff.x {
        output.push('>');
      }
    }
    if self.position.x == 0 && diff.y > 0 {
      for _ in 0..diff.y {
        output.push('^');
      }
    }
    if diff.y < 0 {
      for _ in 0..diff.y.abs() {
        output.push('v');
      }
    }
    if dest.x == 0 && diff.x < 0 {
      for _ in 0..diff.x.abs() {
        output.push('<');
      }
    }
    self.position = dest;
    output.push('A');
    output
  }
}

#[wasm_bindgen]
pub fn part_one(input: &str) -> Vec<String> {
  input.lines()
    .map(|code| {
      let mut numpad = NumericPad::new();
      let mut dpad_1 = DirectionalPad::new();
      let mut dpad_2 = DirectionalPad::new();
      code.chars()
        .flat_map(|ch| numpad.goto(ch).into_iter())
        .flat_map(|ch| dpad_1.goto(ch).into_iter())
        /* .flat_map(|ch| dpad_2.goto(ch).into_iter()) */
        .collect::<String>()
        /* .count() * code[0..3].parse::<usize>().unwrap() */
    })
   /*  .last().unwrap() */
    .collect()
   /*  .sum() */
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> usize {
  0
}

#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-21.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 0));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-21.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 0));
    }
}

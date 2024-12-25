//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]

#[path = "../../utils/main.rs"]
mod utils;

use utils::*;
use wasm_bindgen::prelude::*;
use std::collections::VecDeque;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}

enum {
  Activate,
  Up,
  Down,
  Left,
  Right
}

#[derive(Clone, Copy, Debug, Display)]
struct NumericPad {
  position: Vec2,
  code: &str,
}

impl NumericPad {
  fn is_valid(&self) -> bool {
    self.position.x >= 0
    && self.position.x <= 2
    && self.position.y >= 0
    && self.position.y <= 3
    && self.position != Vec2::ZERO
  }
  fn move(&self, action: Action) => Self {
    match action {
      Activate => self.clone(),
      Up => Self {
        position: self.position + Vec2::Y,
        code: self.code.clone()
      },
      Down => Self {
        position: self.position + Vec2::NEG_Y,
        code: self.code.clone()
      },
      Left => Self {
        position: self.position + Vec2::NEG_X,
        code: self.code.clone()
      },
      Right => Self {
        position: self.position + Vec2::X,
        code: self.code.clone()
      }
    }
  }
}

#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
  input.lines()
    .map(|code| {
      let mut queue = VecDeque::<(usize, &str, Vec2, Vec2, Vec2)>::new();
      queue.push_back(
        (0, "", Vec2::new(2, 0), Vec2::new(1, 2), Vec2::new(1, 2))
      );
      while let Some(
        (length, entered_code, numeric_pad, direct_pad_1, direct_pad_2)
      ) = queue.pop_front() {
        if entered_code == code {
          return length * code[0..3][..].parse::<usize>().unwrap();
        }

      }
    })
  .sum()
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
        let input = include_str!("../../utils/.cache/{}-{}.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 0));
    }
}

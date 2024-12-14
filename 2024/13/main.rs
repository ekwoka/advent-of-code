//! ```cargo
//! [dependencies]
//! regex = "1.11.1"
//! ```
#![feature(test)]
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
  let digits = regex::Regex::new(r"\d+").unwrap();
  input.split("\n\n").map(|machine| {
    let mut attributes = machine.lines().map(|line| {
      let coords = digits.captures_iter(line).map(|digit| digit.get(0).unwrap().as_str().parse::<usize>().unwrap()).collect::<Vec<_>>();
      Vec2(coords[0],coords[1])
    });
    let button_a = attributes.next().unwrap();
    let button_b = attributes.next().unwrap();
    let prize = attributes.next().unwrap();
    let ratio = prize.0 as f32 / prize.1 as f32;
    let a_shallow = (button_a.0 as f32 / button_a.1 as f32) > (button_b.0 as f32 / button_b.1 as f32);
    let mut location = Vec2(0,0);
    let mut button_presses = (0,0);
    while location != prize && location.0 < prize.0 && location.1 < prize.1 {
      let loc_ratio = location.0 as f32 / location.1 as f32;
      if loc_ratio < ratio {
        if a_shallow {
          location = location + button_b;
          button_presses.1 += 1
        } else {
          location = location + button_a;
          button_presses.0 += 1
        }
      } else {
        if a_shallow {
          location = location + button_a;
          button_presses.0 += 1
        } else {
          location = location + button_b;
          button_presses.1 += 1
        }
      }
    }
    if location == prize {
      button_presses.0 * 3 + button_presses.1
    } else {
      0
    }
  }).sum()
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> usize {
  0
}

#[derive(Eq, PartialEq, Clone,Copy,Debug)]
struct Vec2(usize,usize);

impl std::ops::Add for Vec2 {
  type Output = Self;
  fn add(self, rhs: Self) -> Self {
    Vec2(self.0 + rhs.0, self.1 + rhs.1)
  }
}

#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/{}-{}.txt").trim();
        b.iter(move || part_one(input));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/{}-{}.txt").trim();
        b.iter(move || part_two(input));
    }
}

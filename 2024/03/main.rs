//! ```cargo
//! [dependencies]
//! ```
//! --- Day 3: Mull It Over ---
//! Part    Time       Rank
//!   1     01:27:43   18638
//!   2     01:40:08   15011
//!
//! The Toboggan Rental shows computers are on the fritz
//! Luckily all it does is multiply numbers, so lets look through the program
//! and find the multiplication instructions
#![feature(test)]
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}

/// Part one just requires finding all the multiplication instructions
/// and evaluating them
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
  regex::Regex::new(r"mul\((\d+),(\d+)\)").unwrap()
    .captures_iter(&input)
    .map(|cap| cap.extract())
    .map(|(_,[l,r])| (l.parse::<usize>().unwrap(), r.parse::<usize>().unwrap()))
    .map(|(a,b)| a * b)
    .sum()
}

/// Part two we realize there are 2 other instructions do and don't
/// These enable and disable the multiplication instructions
#[wasm_bindgen]
pub fn part_two(input: &str) -> usize {
  let mul_binding = regex::Regex::new(r"mul\((\d+),(\d+)\)").unwrap();
  input.split("do()")
    .filter_map(|todo| todo.split("don't()").nth(0))
    .map(|todo| mul_binding
      .captures_iter(todo)
      .map(|cap| cap.extract())
      .map(|(_,[l,r])| (l.parse::<usize>().unwrap(), r.parse::<usize>().unwrap()))
      .map(|(a,b)| a * b)
      .sum::<usize>()
    )
    .sum()
}

#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-03.txt").trim();
        b.iter(move || part_one(input));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-03.txt").trim();
        b.iter(move || part_two(input));
    }
}

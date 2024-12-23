//! ```cargo
//! [dependencies]
//! ```
//! --- Day 19: Linen Layout ---
#![feature(test)]
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
  let (towels, patterns) = input.split_once("\n\n").unwrap();
  let towels = towels.split(", ").collect::<Vec<_>>();
  patterns.lines().filter(|pattern| {
    let mut queue = vec![*pattern];
    while let Some(remaining) = queue.pop() {
      if remaining.len() == 0 {
        return true;
      }
      towels.iter()
        .filter_map(|towel| remaining.strip_prefix(towel))
        .for_each(|remaining| queue.push(remaining));
    }
    false
  }).count()
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
        let input = include_str!("../../utils/.cache/{}-{}.txt").trim();
        b.iter(move || part_one(input));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/{}-{}.txt").trim();
        b.iter(move || part_two(input));
    }
}

//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]

#[path = "../../utils/main.rs"]
mod utils;

use utils::*;
use wasm_bindgen::prelude::*;
// use regex::regex;
// use web_sys::console;
// use std::collections::HashMap;
// use std::collections::HashSet;
// use std::collections::VecDeque;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> u64 {
  input.lines()
    .filter_map(|line| line.parse::<u64>().ok())
    .map(|secret| {
      (0..2000).fold(secret, |secret, _| {
        let secret = ((secret * 64) ^ secret) % 16_777_216;
        let secret = ((secret / 32) ^ secret) % 16_777_216;
        let secret = ((secret * 2048) ^ secret) % 16_777_216;
        secret
      })
    }).sum()
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
        let input = include_str!("../../utils/.cache/2024-22.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 0));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/{}-{}.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 0));
    }
}

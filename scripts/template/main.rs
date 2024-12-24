//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]

#[path = "../../utils/main.rs"]
mod utils;

use utils::*;
use wasm_bindgen::prelude::*;
// use std::collections::HashMap
// use std::collections::HashSet
// use std::collections::VecDeque

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
  0
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
        b.iter(move || assert_eq!(part_one(input), 0));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/{}-{}.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 0));
    }
}

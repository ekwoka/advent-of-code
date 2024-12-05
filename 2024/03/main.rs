//! ```cargo
//! [dependencies]
//! regex = "1.11.1"
//! ```
//! --- Day 3: Mull It Over ---
//! Part    Time       Rank
//!   1     01:27:43   18638
//!   2     01:40:08   15011
//!
//! The Toboggan Rental shows computers are on the fritz
//! Luckily all it does is multiply numbers, so lets look through the program
//! and find the multiplication instructions

use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}

/// Part one just requires finding all the multiplication instructions
/// and evaluating them
#[wasm_bindgen]
pub fn part_one(input: String) -> usize {
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
pub fn part_two(input: String) -> usize {
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

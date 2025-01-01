//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]

use wasm_bindgen::prelude::*;
use std::collections::HashSet;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
  let schematics = input.split("\n\n")
    .map(|schematic| schematic.lines()
      .enumerate()
      .flat_map(|(y, line)| line.chars()
        .enumerate()
        .filter(|(_,ch)| ch == &'#')
        .map(move|(x, _)| (x,y))
      ).collect::<HashSet<_>>()
    ).collect::<Vec<_>>();

  schematics.clone().iter().enumerate()
    .flat_map(|(i,schema)|
      schematics.iter()
        .skip(i+1)
        .map(move |schemb| (schema, schemb))
    ).filter(|(a,b)| a.is_disjoint(b))
    .count()
}

#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-25.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 3_242));
    }
}

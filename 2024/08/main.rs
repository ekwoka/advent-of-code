//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]
#[path = "../../utils/main.rs"]
mod utils;

use utils::*;
use wasm_bindgen::prelude::*;
use std::collections::HashSet;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
  let height = input.lines().count() as i32;
  let width = input.lines().nth(0).unwrap().chars().count() as i32;
  let antennae = input.lines().enumerate().flat_map(|(y,line)| line.chars().enumerate().filter(|(_,ch)| ch != &'.').map(move |(x, ch)| Antenna(ch.to_owned(), Vec2::new(x as i32,y as i32)))).collect::<Vec<_>>();
  antennae.iter().flat_map(|antenna| antennae.iter()
    .filter_map(move |other| {
      if *other != *antenna && antenna.same_frequency(other) {
        Some(antenna.get_antinodes(other))
      } else {
        None
      }
    }).flatten()
  )
  .filter(|antinode| antinode.x >= 0 && antinode.x < width && antinode.y >= 0 && antinode.y < height)
  .collect::<HashSet<_>>().len()
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> usize {
  let height = input.lines().count() as i32;
  let width = input.lines().nth(0).unwrap().chars().count() as i32;
  let antennae = input.lines().enumerate().flat_map(|(y,line)| line.chars().enumerate().filter(|(_,ch)| ch != &'.').map(move |(x, ch)| Antenna(ch.to_owned(), Vec2::new(x as i32,y as i32)))).collect::<Vec<_>>();
  antennae.iter().flat_map(|antenna| antennae.iter()
    .filter_map(move |other| {
      if *other != *antenna && antenna.same_frequency(other) {
        Some((antenna.1, antenna.get_diff(other)))
      } else {
        None
      }
    }))
  .flat_map(|(position, offset)| {
    let low = std::cmp::max(position.x / offset.x.abs(), position.y / offset.y.abs()) * -1;
    let high = std::cmp::max((width - position.x) / offset.x.abs(), (height - position.y) / offset.y.abs());
    (low..high+1).map(move|steps| offset * steps + position)
  })
  .filter(|node| node.x >= 0 && node.x < width && node.y >= 0 && node.y < height)
  .collect::<HashSet<_>>().len()
}

#[derive(Eq, PartialEq, Clone,Copy,Debug)]
struct Antenna(char,Vec2);

impl Antenna {
  fn same_frequency(&self, rhs: &Antenna) -> bool {
    self.0 == rhs.0
  }
  fn get_antinodes(&self, rhs: &Antenna) -> Vec<Vec2> {
    let diff = self.1 - rhs.1;
    vec![self.1 + diff, rhs.1 - diff]
  }

  fn get_diff(&self, rhs: &Antenna) -> Vec2 {
    self.1 - rhs.1
  }
}

#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-08.txt").trim();
        b.iter(move || part_one(input));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-08.txt").trim();
        b.iter(move || part_two(input));
    }
}

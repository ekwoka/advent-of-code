//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]
use wasm_bindgen::prelude::*;
use std::collections::{HashSet, VecDeque};

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str, max: usize, bytes: usize) -> usize {
  let memory = input.lines()
    .take(bytes)
    .map(|line| {
      let mut coords = line.split(",").filter_map(|n| n.parse::<usize>().ok());
      (coords.next().unwrap(), coords.next().unwrap())
    }).collect::<HashSet<_>>();
  let mut queue = VecDeque::<(usize, (usize, usize))>::new();
  queue.push_back((0, (0, 0)));
  let mut visited = HashSet::<(usize, usize)>::new();
  while let Some((steps, (x, y))) = queue.pop_front() {
    if memory.contains(&(x, y)) || visited.contains(&(x, y)) {
      continue;
    } else {
      visited.insert((x, y));
    }
    if x == max && y == max {
      return steps;
    }

    if x > 0 {
      queue.push_back((steps+1, (x-1, y)));
    }
    if x < max {
      queue.push_back((steps+1, (x+1, y)));
    }
    if y > 0 {
      queue.push_back((steps+1, (x, y-1)));
    }
    if y < max {
      queue.push_back((steps+1, (x, y+1)));
    }
  }
  0
}

#[wasm_bindgen]
pub fn part_two(input: &str, max: usize, start: usize) -> String {
  let bytes = input.lines().collect::<Vec<_>>();
  let blocking_byte = (start+1..bytes.len()).filter(|idx|
    part_one(input, max, idx+1) == 0
  ).nth(0).unwrap();
  bytes[blocking_byte].to_string()
}

#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-18.txt").trim();
        b.iter(move || assert_eq!(part_one(input, 70, 1024), 306));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-18.txt").trim();
        b.iter(move || assert_eq!(part_two(input, 70, 1024), "38,63"));
    }
}

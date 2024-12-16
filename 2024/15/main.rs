//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
  let (grid, instructions) = input.split_once("\n\n").unwrap();
  let walls = grid.lines().enumerate()
    .flat_map(|(y, line)| line.chars()
      .enumerate()
      .filter(|(_,ch)| ch == &'#')
      .map(move |(x, _)| (x as i32,y as i32))
    )
    .collect::<std::collections::HashSet<_>>();
  let mut rocks = grid.lines().enumerate()
    .flat_map(|(y, line)| line.chars()
      .enumerate()
      .filter(|(_,ch)| ch == &'O')
      .map(move |(x, _)| (x as i32,y as i32))
    )
    .collect::<std::collections::HashSet<_>>();
  let mut robot = grid.lines().enumerate()
    .flat_map(|(y, line)| line.chars()
      .enumerate()
      .filter(|(_,ch)| ch == &'@')
      .map(move |(x, _)| (x as i32,y as i32))
    )
    .nth(0).unwrap();
  for movement in instructions.chars()
    .map(|ch| match ch {
      '<' => (-1, 0),
      '^' => (0, -1),
      '>' => (1, 0),
      'v' => (0, -1),
      _ => (0,0)
    }) {
      if walls.contains(&(robot.0 + movement.0, robot.1 + movement.1)) {
        continue;
      }
      if !rocks.contains(&(robot.0 + movement.0, robot.1 + movement.1)) {
        robot.0 += movement.0;
        robot.1 += movement.1;
        continue
      }
    }
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
        b.iter(move || part_one(input));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/{}-{}.txt").trim();
        b.iter(move || part_two(input));
    }
}

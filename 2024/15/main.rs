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
  let mut map = grid.lines().map(|line| line.chars().collect::<Vec<_>>()).collect::<Vec<_>>();
  let mut robot = grid.lines().enumerate()
    .flat_map(|(y, line)| line.chars()
      .enumerate()
      .filter(|(_,ch)| ch == &'@')
      .map(move |(x, _)| (x as i32,y as i32))
    )
    .nth(0).unwrap();
  map[robot.1 as usize][robot.0 as usize] = '.';
  for movement in instructions.chars()
    .map(|ch| match ch {
      '<' => (-1, 0),
      '^' => (0, -1),
      '>' => (1, 0),
      'v' => (0, 1),
      _ => (0,0)
    }) {

    match map[(robot.1 + movement.1) as usize][(robot.0 + movement.0) as usize] {
      '#' => continue,
      '.' => {
        robot.0 += movement.0;
        robot.1 += movement.1;
      },
      'O' => {
        let mut marker = robot.clone();
        'inner: loop {
          marker.0 += movement.0;
          marker.1 += movement.1;
          if map[marker.1 as usize][marker.0 as usize] != 'O' {
            break 'inner;
          }
        }
        match map[marker.1 as usize][marker.0 as usize] {
          '#' => continue,
          '.' => {
            map[marker.1 as usize][marker.0 as usize] = 'O';
            robot.0 += movement.0;
            robot.1 += movement.1;
            map[robot.1 as usize][robot.0 as usize] = '.';
          },
          _ => ()
        }
      },
      _ => ()
    }
  }
  map.iter()
    .enumerate()
    .flat_map(|(y,row)| row.iter()
      .enumerate()
      .filter(|(_, ch)| ch == &&'O')
      .map(move |(x,_)| y * 100 + x))
    .sum()
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

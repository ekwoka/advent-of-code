//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]

#[path = "../../utils/main.rs"]
mod utils;
use utils::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str, limit: usize) -> usize {
  let grid = input.lines().map(|line| line.chars().collect::<Vec<_>>()).collect::<Vec<_>>();
  let start = grid.iter()
    .enumerate()
    .flat_map(|(y,row)| row.iter()
      .enumerate()
      .map(move |(x, ch)| ((x,y), ch))
    ).filter(|(_,ch)| *ch == &'S')
    .map(|((x, y), _)| Vec2::new(x as i32, y as i32))
    .nth(0).unwrap();
  let mut times = std::collections::HashMap::<Vec2, usize>::new();

  let mut queue = vec![(0, start.clone())];
  while let Some((picos, coords)) = queue.pop() {
    if times.contains_key(&coords) {
      continue;
    } else {
      times.insert(coords.clone(), picos);
    }
    Vec2::NEIGHBORS_CARDINAL.into_iter()
      .map(|offset| coords + offset)
      .filter(|target| grid[target.y as usize][target.x as usize] != '#')
      .for_each(|coord| queue.push((picos + 1, coord)));
  }

  let mut shortcuts = 0;
  for (coords, picos) in times.clone().iter() {
    shortcuts += Vec2::NEIGHBORS_CARDINAL.into_iter()
      .map(|offset| *coords + offset + offset)
      .filter(|target| times.contains_key(target))
      .filter(|target| times.get(target).unwrap() >= &(picos + 2 + limit))
      .count();
  }
  shortcuts
}

#[wasm_bindgen]
pub fn part_two(input: &str, limit: usize) -> usize {
    let grid = input.lines().map(|line| line.chars().collect::<Vec<_>>()).collect::<Vec<_>>();
  let start = grid.iter()
    .enumerate()
    .flat_map(|(y,row)| row.iter()
      .enumerate()
      .map(move |(x, ch)| ((x,y), ch))
    ).filter(|(_,ch)| *ch == &'S')
    .map(|((x, y), _)| Vec2::new(x as i32, y as i32))
    .nth(0).unwrap();
  let mut times = std::collections::HashMap::<Vec2, usize>::new();

  let mut all_steps = Vec::<Vec2>::new();
  let mut queue = vec![(0, start.clone())];
  while let Some((picos, coords)) = queue.pop() {
    if times.contains_key(&coords) {
      continue;
    } else {
      times.insert(coords.clone(), picos);
      all_steps.push(coords.clone());
    }
    Vec2::NEIGHBORS_CARDINAL.into_iter()
      .map(|offset| coords + offset)
      .filter(|target| grid[target.y as usize][target.x as usize] != '#')
      .for_each(|coord| queue.push((picos + 1, coord)));
  }

  let mut shortcuts = 0;
  for coord in all_steps.clone() {
    let picos = times.get(&coord).unwrap();
    shortcuts += all_steps.iter().filter(|dest| {
      let distance = coord.manhatten_distance(**dest) as usize;
      if distance > 20 {
        false
      } else {
        picos + distance + limit <= *times.get(dest).unwrap()
      }
    }).count()
  }
  shortcuts
}

#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-20.txt").trim();
        b.iter(move || assert_eq!(part_one(input, 100), 1_332));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-20.txt").trim();
        b.iter(move || assert_eq!(part_two(input, 100), 987_695));
    }
}

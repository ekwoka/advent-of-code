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
pub fn part_one(input: &str, limit: usize) -> usize {
  let grid = input.lines().map(|line| line.chars().collect::<Vec<_>>()).collect::<Vec<_>>();
  let start = grid.iter()
    .enumerate()
    .flat_map(|(y,row)| row.iter()
      .enumerate()
      .map(move |(x, ch)| ((x,y), ch))
    ).filter(|(_,ch)| *ch == &'S')
    .map(|((x, y), _)| Vec2(x, y))
    .nth(0).unwrap();
  let mut times = std::collections::HashMap::<Vec2, usize>::new();

  let mut queue = vec![(0, start.clone())];
  while let Some((picos, coords)) = queue.pop() {
    if times.contains_key(&coords) {
      continue;
    } else {
      times.insert(coords.clone(), picos);
    }
    if grid[coords.1][coords.0] == 'E' {
      break;
    }
    vec![Vec2::X(), Vec2::Y()].into_iter()
      .flat_map(|offset| vec![coords + offset, coords - offset].into_iter())
      .filter(|target| grid[target.1][target.0] != '#')
      .for_each(|coord| queue.push((picos + 1, coord)));
  }

  let mut shortcuts = 0;
  let mut queue = vec![(0, start.clone())];
  while let Some((picos, coords)) = queue.pop() {
    if grid[coords.1][coords.0] == 'E' {
      break;
    }
    shortcuts += vec![Vec2::X(), Vec2::Y()].into_iter()
      .flat_map(|offset| vec![coords + offset + offset, coords - offset - offset].into_iter())
      .filter(|target| times.contains_key(target))
      .filter(|target| times.get(target).unwrap() >= &(picos + 2 + limit))
      .count();
    vec![Vec2::X(), Vec2::Y()].into_iter()
      .flat_map(|offset| vec![coords + offset, coords - offset].into_iter())
      .filter(|target| times.contains_key(target))
      .filter(|target| times.get(target).unwrap() == &(picos + 1))
      .for_each(|coord| queue.push((picos + 1, coord)));
  }
  shortcuts
}

#[derive(Eq, PartialEq, Clone, Copy, Debug)]
struct Vec2(usize, usize);

impl Vec2 {
  fn distance(&self, rhs: Self) -> usize {
    self.0.abs_diff(rhs.0) + self.1.abs_diff(rhs.1)
  }
  fn X() -> Self {
    Vec2(1,0)
  }
  fn Y() -> Self {
    Vec2(0,1)
  }
}

impl std::ops::Add for Vec2 {
  type Output = Self;
  fn add(self, rhs: Self) -> Self {
    Vec2(self.0 + rhs.0, self.1 + rhs.1)
  }
}

impl std::ops::Sub for Vec2 {
  type Output = Self;
  fn sub(self, rhs: Self) -> Self {
    Vec2(self.0.saturating_sub(rhs.0), self.1.saturating_sub(rhs.1))
  }
}

impl std::hash::Hash for Vec2 {
  fn hash<H>(&self, hasher: &mut H) where H: std::hash::Hasher, {
    format!("{},{}",self.0, self.1).hash(hasher)
  }
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
    .map(|((x, y), _)| Vec2(x, y))
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
    if grid[coords.1][coords.0] == 'E' {
      break;
    }
    vec![Vec2::X(), Vec2::Y()].into_iter()
      .flat_map(|offset| vec![coords + offset, coords - offset].into_iter())
      .filter(|target| grid[target.1][target.0] != '#')
      .for_each(|coord| queue.push((picos + 1, coord)));
  }

  let mut shortcuts = 0;
  for coord in all_steps.clone() {
    let picos = times.get(&coord).unwrap();
    shortcuts += all_steps.iter().filter(|dest| {
      let distance = coord.distance(**dest);
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
        let input = include_str!("../../utils/.cache/2024-20.txt").trim();
        b.iter(move || part_one(input));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-20.txt").trim();
        b.iter(move || part_two(input));
    }
}

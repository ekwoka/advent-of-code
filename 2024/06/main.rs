//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]
use wasm_bindgen::prelude::*;
use std::collections::HashSet;
#[derive(Eq, PartialEq, Clone,Copy,Debug)]
struct Vec2(i32,i32);

impl Vec2 {
  fn rotate(&self) -> Self {
    match self {
        &Vec2(0,-1) => Vec2(1,0),
        &Vec2(1,0) => Vec2(0,1),
        &Vec2(0,1) => Vec2(-1,0),
        _ => Vec2(0,-1),
      }
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
    Vec2(self.0 - rhs.0, self.1 - rhs.1)
  }
}

impl std::hash::Hash for Vec2 {
  fn hash<H>(&self, hasher: &mut H) where H: std::hash::Hasher, {
    format!("{},{}",self.0, self.1).hash(hasher)
  }
}
#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
  let height = input.lines().count() as i32;
  let width = input.lines().nth(0).unwrap().len() as i32;
  let obstacles = collect_obstacles(&input);
  let mut guard = find_guard(&input).unwrap();
  let mut dir = Vec2(0,-1);
  let mut steps = HashSet::<Vec2>::new();
  steps.insert(guard.clone());
  loop {
    guard = guard + dir;
    if is_outside(guard, &width, &height) {
      break
    }
    steps.insert(guard.clone());
    while obstacles.contains(&(guard + dir)) {
      dir = dir.rotate();
    }
  }
  steps.len()
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> usize {
  let height = input.lines().count() as i32;
  let width = input.lines().nth(0).unwrap().len() as i32;
  let obstacles = collect_obstacles(&input);
  let guard_start = find_guard(&input).unwrap();

  let mut guard = find_guard(&input).unwrap();
  let mut dir = Vec2(0,-1);
  let mut steps = HashSet::<Vec2>::new();
  steps.insert(guard.clone());
  let steps = std::iter::from_fn(|| {
      guard = guard + dir;
      if is_outside(guard, &width, &height) {
        return None;
      }
      while obstacles.contains(&(guard + dir)) {
        dir = dir.rotate();
      }
      Some(guard.clone())
  });

  steps
    .filter(|added_obstacle| !(*added_obstacle == guard_start || obstacles.contains(added_obstacle)))
    .filter(|added_obstacle| {
      let mut known_steps = HashSet::<(Vec2, Vec2)>::new();
      let mut obstacles = obstacles.clone();
      obstacles.insert((*added_obstacle).clone());
      let mut guard = guard_start.clone();
      let mut dir = Vec2(0,-1);
      loop {
        guard = guard + dir;
        if known_steps.contains(&(guard,dir)) {
          return true
        }
        if is_outside(guard, &width, &height) {
          return false;
        }
        known_steps.insert((guard.clone(),dir.clone()));

        if let Some(next) = get_nearest_obstacle(&obstacles, &guard, &dir) {
          guard = next;
          while obstacles.contains(&(guard + dir)) {
            dir = dir.rotate();
          }
        } else {
          return false;
        }
      }
    }).collect::<HashSet<_>>().len()
}

fn collect_obstacles(input: &str) -> HashSet<Vec2> {
  input.lines()
    .enumerate()
    .flat_map(|(y,line)| line.chars()
      .enumerate()
      .filter(|(_,ch)| ch == &'#')
      .map(move |(x,_)| Vec2(x as i32,y as i32)))
    .collect::<std::collections::HashSet<_>>()
}

fn find_guard(input: &str) -> Option<Vec2> {
  input.lines()
    .enumerate()
    .flat_map(|(y,line)| line.chars()
      .enumerate()
      .filter(|(_,ch)| ch == &'^')
      .map(move |(x,_)| Vec2(x as i32,y as i32)))
    .nth(0)
}

fn is_outside(pos: Vec2, w: &i32, h: &i32) -> bool {
  pos.0 < 0 || &pos.0 >= w || pos.1 < 0 || &pos.1 >= h
}

fn get_nearest_obstacle(obstacles: &HashSet<Vec2>, current: &Vec2, direction: &Vec2) -> Option<Vec2> {
  let mut forward_obstacles = obstacles.iter()
    .filter(|obstacle| {
      let offset = **obstacle - *current;
      offset.0.signum() == direction.0.signum() && offset.1.signum() == direction.1.signum()
    }).map(|obstacle| (*obstacle - *direction, *obstacle - *current))
    .collect::<Vec<_>>();
  forward_obstacles.sort_by(|(_,a),(_,b)| (a.0.abs()+a.1.abs()).cmp(&(b.0.abs()+b.1.abs())));

  forward_obstacles.get(0).map(|(pos,_)| pos).copied()
}

#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-06.txt").trim();
        b.iter(move || part_one(input));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-06.txt").trim();
        b.iter(move || part_two(input));
    }
}

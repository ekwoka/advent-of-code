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
  let height = input.lines().count() as i32;
  let width = input.lines().nth(0).unwrap().chars().count() as i32;
  let antennae = input.lines().enumerate().flat_map(|(y,line)| line.chars().enumerate().filter(|(_,ch)| ch != &'.').map(move |(x, ch)| Antenna(ch.to_owned(), Vec2(x as i32,y as i32)))).collect::<Vec<_>>();
  antennae.iter().flat_map(|antenna| antennae.iter()
    .filter_map(move |other| {
      if *other != *antenna && antenna.same_frequency(other) {
        Some(antenna.get_antinodes(other))
      } else {
        None
      }
    }).flatten()
  )
  .filter(|antinode| antinode.0 >= 0 && antinode.0 < width && antinode.1 >= 0 && antinode.1 < height)
  .collect::<std::collections::HashSet<_>>().len()
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> usize {
  let height = input.lines().count() as i32;
  let width = input.lines().nth(0).unwrap().chars().count() as i32;
  let antennae = input.lines().enumerate().flat_map(|(y,line)| line.chars().enumerate().filter(|(_,ch)| ch != &'.').map(move |(x, ch)| Antenna(ch.to_owned(), Vec2(x as i32,y as i32)))).collect::<Vec<_>>();
  antennae.iter().flat_map(|antenna| antennae.iter()
    .filter_map(move |other| {
      if *other != *antenna && antenna.same_frequency(other) {
        Some((antenna.1, antenna.get_diff(other)))
      } else {
        None
      }
    }))
  .flat_map(|(position, offset)| {
    let low = std::cmp::max(position.0 / offset.0.abs(), position.1 / offset.1.abs()) * -1;
    let high = std::cmp::max((width - position.0) / offset.0.abs(), (height - position.1) / offset.1.abs());
    (low..high+1).map(move|steps| offset * steps + position)
  })
  .filter(|node| node.0 >= 0 && node.0 < width && node.1 >= 0 && node.1 < height)
  .collect::<std::collections::HashSet<_>>().len()
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

#[derive(Eq, PartialEq, Clone,Copy,Debug)]
struct Vec2(i32,i32);

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

impl std::ops::Mul for Vec2 {
  type Output = Self;
  fn mul(self, rhs: Self) -> Self {
    Vec2(self.0 * rhs.0, self.1 * rhs.1)
  }
}

impl std::ops::Mul<i32> for Vec2 {
  type Output = Self;
  fn mul(self, rhs: i32) -> Self {
    Vec2(self.0 * rhs, self.1 * rhs)
  }
}

impl std::hash::Hash for Vec2 {
  fn hash<H>(&self, hasher: &mut H) where H: std::hash::Hasher, {
    format!("{},{}",self.0, self.1).hash(hasher)
  }
}

#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-08.txt").trim();
        b.iter(move || part_one(input));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-08.txt").trim();
        b.iter(move || part_two(input));
    }
}

//! ```cargo
//! [dependencies]
//! regex = "1.11.1"
//! ```
#![feature(test)]
#![feature(int_roundings)]
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str, width: i32, height: i32) -> usize {
  let digits = regex::Regex::new(r"-?\d+").unwrap();
  input.lines().map(|line| {
    let numbers =  digits.captures_iter(line).map(|digit| digit.get(0).unwrap().as_str().parse::<i32>().unwrap()).collect::<Vec<_>>();
    let mut pos = (numbers[0], numbers[1]);
    let velocity = (numbers[2], numbers[3]);
    pos.0 = (pos.0 + velocity.0 * 100).rem_euclid(width);
    pos.1 = (pos.1 + velocity.1 * 100).rem_euclid(height);
    pos
  })
  .filter_map(|(x,y)| {
    if x < (width.div_floor(2)) {
      if y < (height.div_floor(2)) {
        return Some(0)
      } else if y > height.div_floor(2) {
        return Some(1)
      }
    } else if x > width.div_floor(2) {
      if y < height.div_floor(2) {
        return Some(2)
      } else if y > height.div_floor(2) {
        return Some(3)
      }
    }
    None
  }).fold([0,0,0,0], |mut quads, next| {
    quads[next] += 1;
    quads
  }).iter().product()
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> usize {
  let digits = regex::Regex::new(r"-?\d+").unwrap();
  let robots = input.lines().map(|line| {
    let numbers =  digits.captures_iter(line).map(|digit| digit.get(0).unwrap().as_str().parse::<i32>().unwrap()).collect::<Vec<_>>();
    let pos = (numbers[0], numbers[1]);
    let velocity = (numbers[2], numbers[3]);
    (pos, velocity)
  }).collect::<Vec<_>>();
  (0..).map(|i| robots.iter()
    .map(move |(pos, velocity)|
      ((pos.0 + velocity.0 * i).rem_euclid(101),
      (pos.1 + velocity.1 * i).rem_euclid(103))
    ).collect::<std::collections::HashSet<_>>()
  ).position(|set| set.iter().any(|robot|
    (-1..2).flat_map(|x| (-1..2).map(move |y| (x,y)))
  .all(|(x,y)| set.contains(&(robot.0 + x, robot.1 + y))))).unwrap()
}


#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-14.txt").trim();
        b.iter(move || part_one(input, 101, 103));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-14.txt").trim();
        b.iter(move || part_two(input));
    }
}

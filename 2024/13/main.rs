//! ```cargo
//! [dependencies]
//! regex = "1.11.1"
//! ```
#![feature(test)]
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
  let digits = regex::Regex::new(r"\d+").unwrap();
  input.split("\n\n").filter_map(|machine| {
    let mut attributes = machine.lines().map(|line| {
      let coords = digits.captures_iter(line).map(|digit| digit.get(0).unwrap().as_str().parse::<usize>().unwrap()).collect::<Vec<_>>();
      Vec2(coords[0],coords[1])
    });
    let button_a = attributes.next().unwrap();
    let button_b = attributes.next().unwrap();
    let prize = attributes.next().unwrap();
    (0..101).flat_map(|a| (0..101).map(move |b| (a,b)))
      .find(|(a,b)| button_a.scale(a) + button_b.scale(b) == prize)
  })
  .map(|(a,b)| a * 3 + b)
  .sum()
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> u64 {
  let digits = regex::Regex::new(r"\d+").unwrap();
  input.split("\n\n").filter_map(|machine| {
    let mut attributes = machine.lines().flat_map(|line|
      digits.captures_iter(line).map(|digit| digit.get(0).unwrap().as_str().parse::<f64>().unwrap())
    );

    let a1 = attributes.next().unwrap();
    let a2 = attributes.next().unwrap();
    let b1 = attributes.next().unwrap();
    let b2 = attributes.next().unwrap();
    let c1 = attributes.next().unwrap() + 10000000000000f64;
    let c2 = attributes.next().unwrap() + 10000000000000f64;
    let d = a1 * b2 - a2 * b1;
    let dx = c1 * b2 - c2 * b1;
    let dy = a1 * c2 - a2 * c1;
    let x = dx / d;
    let y = dy / d;
    if x == x.round() && y == y.round() {
      Some((x as u64,y as u64))
    } else {
      None
    }
  })
  .map(|(a,b)| a * 3 + b)
  .sum()
}

#[derive(Eq, PartialEq, Clone,Copy,Debug)]
struct Vec2(usize,usize);

impl Vec2 {
  fn scale(&self, scalar: &usize) -> Vec2 {
    Vec2(self.0 * scalar, self.1 * scalar)
  }
}

impl std::ops::Add for Vec2 {
  type Output = Self;
  fn add(self, rhs: Self) -> Self {
    Vec2(self.0 + rhs.0, self.1 + rhs.1)
  }
}



#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-13.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 31_761));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-13.txt").trim();
        b.iter(move || assert_eq!(part_two(input),90_798_500_745_591));
    }
}

//! ```cargo
//! [dependencies]
//! regex = "1.11.1"
//! ```

use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}

#[derive(Clone,Copy,Debug)]
struct Vec2(i32,i32);

impl std::ops::Add for Vec2 {
  type Output = Self;
  fn add(self, rhs: Self) -> Self {
    Vec2(self.0 + rhs.0, self.1 + rhs.1)
  }
}

#[wasm_bindgen]
pub fn part_one(input: String) -> i32 {
  let location = regex::Regex::new(r"(?:n|s)(?:w|e)?").unwrap().captures_iter(&input)
  .map(|caps| caps.extract::<0>()).map(|(ns,_)| match ns {
    "n" => Vec2(2,0),
    "s" => Vec2(-2,0),
    "ne" => Vec2(1,1),
    "nw" => Vec2(1,-1),
    "se" => Vec2(-1,1),
    "sw" => Vec2(-1,-1),
    _ => Vec2(0,0)
  }).reduce(|a,b| a + b).unwrap();

  location.1.abs() + std::cmp::max(0, (location.0.abs() - location.1.abs()) / 2)
}

#[wasm_bindgen]
pub fn part_two(input: String) -> i32 {
  regex::Regex::new(r"(?:n|s)(?:w|e)?").unwrap().captures_iter(&input)
  .map(|caps| caps.extract::<0>()).map(|(ns,_)| match ns {
    "n" => Vec2(2,0),
    "s" => Vec2(-2,0),
    "ne" => Vec2(1,1),
    "nw" => Vec2(1,-1),
    "se" => Vec2(-1,1),
    "sw" => Vec2(-1,-1),
    _ => Vec2(0,0)
  }).scan(Vec2(0,0), |pos, change| {
    *pos = *pos + change;
    Some(*pos)
  }).map(|vec| {
    vec.1.abs() + std::cmp::max(0, (vec.0.abs() - vec.1.abs()) / 2)
  }).max().unwrap()
}

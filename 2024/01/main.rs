//! ```cargo
//! [dependencies]
//! regex = "1.11.1"
//! ```

use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: String) -> i32 {
  let binding = regex::Regex::new(r"\d+").unwrap();

  let (mut list_one, mut list_two) = input.lines()
    .map(|line| binding.captures_iter(&line)
      .map(|caps| caps.extract::<0>())
      .map(|(n, _)| n.parse::<i32>().unwrap())
      .collect::<Vec<i32>>())
    .fold((vec![], vec![]), |mut vecs,nums| {
      vecs.0.push(nums[0]);
      vecs.1.push(nums[1]);
      vecs
    });
    list_one.sort();
    list_two.sort();
    list_one.iter().zip(list_two.iter()).map(|(l,r)| (l - r).abs()).sum()
}

#[wasm_bindgen]
pub fn part_two(input: String) -> usize {
  let binding = regex::Regex::new(r"\d+").unwrap();

  let (list_one, list_two) = input.lines()
    .map(|line| binding.captures_iter(&line)
      .map(|caps| caps.extract::<0>())
      .map(|(n, _)| n.parse::<usize>().unwrap())
      .collect::<Vec<_>>())
    .fold((vec![], vec![]), |mut vecs,nums| {
      vecs.0.push(nums[0]);
      vecs.1.push(nums[1]);
      vecs
    });
  list_one.iter().map(|num| num * list_two.iter().filter(|num2| *num2 == num).count()).sum()
}

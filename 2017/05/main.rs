//! ```cargo
//! [dependencies]
//! ```

use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: String) -> usize {
  let mut instructions = input.lines().map(|line| line.parse::<i32>().expect("Input to be valid")).collect::<Vec<_>>();
  let mut position = 0i32;
  let mut count = 0;
  loop {
    if position >= instructions.len() as i32 {
      return count
    }
    let change = instructions[position as usize];
    instructions[position as usize]+=1;
    position += change;
    count+=1;
  }
}

#[wasm_bindgen]
pub fn part_two(input: String) -> usize {
  let mut instructions = input.lines().map(|line| line.parse::<i32>().expect("Input to be valid")).collect::<Vec<_>>();
  let mut position = 0i32;
  let mut count = 0;
  loop {
    if position < 0 || position >= instructions.len() as i32 {
      return count
    }
    let change = instructions[position as usize];
    if change >= 3 {
      instructions[position as usize] -= 1;
    } else {
      instructions[position as usize] += 1;
    }
    position += change;
    count+=1;
  }
}

//! ```cargo
//! [dependencies]
//! ```

use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: String) -> f64 {
  let mut output: f64 = 0.0;
  let mut iter = input.chars();
  while let Some(ch) = iter.next() {
    match ch {
      '(' => {
        let mut length = String::new();
        loop {
          let ch = iter.next().unwrap();
          if ch == 'x' {
            break;
          }
          length.push(ch);
        }
        let mut count = String::new();
        loop {
          let ch = iter.next().unwrap();
          if ch == ')' {
            break;
          }
          count.push(ch);
        }
        let length = length.parse::<u32>().unwrap();
        let count = count.parse::<f64>().unwrap();
        for _ in 0..length {
          iter.next().unwrap();
        }
        output += length as f64 * count
      },
      ' ' => (),
      '\n' => (),
      _ => {
        output += 1.0
      }
    }
  }
  output
}

#[wasm_bindgen]
pub fn part_two(input: String) -> f64 {
  decompressed_length(input) as f64
}

fn decompressed_length(input: String) -> f64 {
  let mut output: f64 = 0.0;
  let mut iter = input.chars();
  while let Some(ch) = iter.next() {
    match ch {
      '(' => {
        let mut length = String::new();
        loop {
          let ch = iter.next().unwrap();
          if ch == 'x' {
            break;
          }
          length.push(ch);
        }
        let mut count = String::new();
        loop {
          let ch = iter.next().unwrap();
          if ch == ')' {
            break;
          }
          count.push(ch);
        }
        let length = length.parse::<u32>().unwrap();
        let count = count.parse::<f64>().unwrap();
        let mut to_repeat = String::new();
        for _ in 0..length {
          to_repeat.push(iter.next().unwrap());
        }
        output += decompressed_length(to_repeat) * count
      }
      ' ' => (),
      '\n' => (),
      _ => {
        output += 1.0
      }
    }
  }
  output
}

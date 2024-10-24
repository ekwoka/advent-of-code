//! ```cargo
//! [dependencies]
//! ```

use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: String, size: usize) -> String {
  let mut data = input.chars().filter(|ch| match ch {
    '0' => true,
    '1' => true,
    _ => false
  }).collect::<String>();
  loop {
    data = data.clone() + "0" + &data.chars().rev().map(|ch| match ch {
      '1' => '0',
      '0' => '1',
      _ => '0'
    }).collect::<String>().as_str();
    if data.len() >= size { break }
  }
  let mut data: Vec<char> = data.chars().take(size).collect();
  loop {
    data = data[..].chunks(2).map(|chs| match chs[0] == chs[1] {
      true => '1',
      false => '0'
    }).collect();
    if data.len() % 2 == 1 { break }
  }
  data.iter().collect()
}

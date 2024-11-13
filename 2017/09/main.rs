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
  let mut chars = input.chars();
  let mut score = 0;
  let mut depth = 0;
  let mut in_garbage = false;
  while let Some(ch) = chars.next() {
    if ch == '!' {
      chars.next();
      continue;
    }
    if in_garbage {
      match ch {
        '>' => {
          in_garbage = false;
        },
        _ => ()
      }
    } else {
      match ch {
        '{' => {
          depth += 1;
        },
        '}' => {
          score += depth;
          depth -= 1;
        },
        '<' => {
          in_garbage = true;
        },
        _ => ()
      }
    }
  }
  score
}

#[wasm_bindgen]
pub fn part_two(input: String) -> usize {
  let mut chars = input.chars();
  let mut count = 0;
  let mut in_garbage = false;
  while let Some(ch) = chars.next() {
    if ch == '!' {
      chars.next();
      continue;
    }
    if in_garbage {
      match ch {
        '>' => {
          in_garbage = false;
        },
        _ => {
          count += 1
        }
      }
    } else {
      match ch {
        '<' => {
          in_garbage = true;
        },
        _ => ()
      }
    }
  }
  count
}

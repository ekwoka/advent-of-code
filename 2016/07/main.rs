//! ```cargo
//! [dependencies]
//! fancy-regex = "0.14.0"
//! ```

use wasm_bindgen::prelude::*;
use fancy_regex::Regex;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: String) -> f64 {
  let hypernet_abba = Regex::new(r"\[[^\]]*?(\w)(?!:\1)(\w)\2\1.*?\]").unwrap();
  let abba = Regex::new(r"(\w)(?!\1)(\w)\2\1").unwrap();
  input.lines().filter(|line| !hypernet_abba.is_match(line).unwrap()).filter(|line| abba.is_match(line).unwrap()).count() as f64
}

#[wasm_bindgen]
pub fn part_two(input: String) -> f64 {
  let ssl_ababab = Regex::new(r"(?:(\w)(?!\1)(\w)\1(?=[^\]]*?\[).*?\[[^\]]*?\2\1\2[^\]]*?\]|\[[^\]]*?(\w)(?!\3)(\w)\3[^\]]*?\].*?\4\3\4(?=[^\]]*?(?:\[|$)))").unwrap();
  input.lines().filter(|line| ssl_ababab.is_match(line).unwrap()).count() as f64
}

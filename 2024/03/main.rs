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
pub fn part_one(input: String) -> usize {
  regex::Regex::new(r"mul\((\d+),(\d+)\)").unwrap()
    .captures_iter(&input)
    .map(|cap| cap.extract())
    .map(|(_,[l,r])| (l.parse::<usize>().unwrap(), r.parse::<usize>().unwrap()))
    .map(|(a,b)| a * b)
    .sum()
}

#[wasm_bindgen]
pub fn part_two(input: String) -> usize {
  regex::Regex::new(r"(?:do\(\)|don't\(\)|mul\(\d+,\d+\))").unwrap()
    .captures_iter(&input)
    .map(|cap| cap.extract::<0>())
    .scan(true, |on, (inst,_)| match inst {
        "do()" => {
          *on = true;
          Some(0usize)
        },
        "don't()" => {
          *on = false;
          Some(0usize)
        },
        str => {
          if *on {
            regex::Regex::new(r"\d+").unwrap()
              .captures_iter(str)
              .map(|cap| cap.extract::<0>())
              .filter_map(|(n,_)| n.parse::<usize>().ok())
              .reduce(|a,b| a * b)
          } else {
            Some(0usize)
          }
        }
      }
    ).sum()
}

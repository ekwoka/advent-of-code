//! ```cargo
//! [dependencies]
//! ```

use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: String) -> u64 {
  input.lines()
    .filter_map(|lines| lines.split_once(": "))
    .filter(|(test,values)| {
      let test = test.parse::<u64>().unwrap();
      let nums = values.split_whitespace().filter_map(|n| n.parse::<u64>().ok()).collect::<Vec<_>>();
      (0..1<<(nums.len()-1)).map(|mask| {
        let mut result = 0u64;
        for (idx,num) in nums.iter().enumerate() {
          if idx == 0 {
            result += num;
          } else {
            match mask & (1 << (idx-1)) {
              0 => result += num,
              _ => result *= num
            };
          }
        }
        result
      }).any(|result| result == test)
    })
    .filter_map( |(test,_)| test.parse::<u64>().ok())
    .sum()
}

#[wasm_bindgen]
pub fn part_two(input: String) -> u64 {
  input.lines()
    .filter_map(|lines| lines.split_once(": "))
    .filter(|(test,values)| {
      let test = test.parse::<u64>().unwrap();
      let nums = values.split_whitespace().filter_map(|n| n.parse::<u64>().ok()).collect::<Vec<_>>();
      (0..1<<((nums.len()*2)-1)).map(|mask| {
        let mut result = 0u64;
        for (idx,num) in nums.iter().enumerate() {
          if idx == 0 {
            result += num;
          } else {
            match (mask >> nums.len()) & (1 << (idx-1)) {
              0 => match mask & (1 << (idx-1)) {
                  0 => result += num,
                  _ => result *= num
                },
              _ => result = format!("{}{}", result, num).parse::<u64>().unwrap()
            }
          }
          if result > test {
            break
          }
        }
        result
      }).any(|result| result == test)
    })
    .filter_map( |(test,_)| test.parse::<u64>().ok())
    .sum()
}

//! ```cargo
//! [dependencies]
//! ```

use wasm_bindgen::prelude::*;
use std::collections::HashMap;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: String) -> i32 {
  let mut registers: HashMap<String, i32> = HashMap::new();
  input.lines()
    .map(|ln| ln.split_whitespace().collect::<Vec<_>>())
    .for_each(|operations| {
      let mut op_iter = operations.iter();
      let target_reg = *op_iter.next().unwrap();
      let target_op = *op_iter.next().unwrap();
      let target_change = op_iter.next().unwrap().parse::<i32>().unwrap();
      op_iter.next();
      let cond_reg = *registers.get(op_iter.next().unwrap().to_owned()).unwrap_or(&0i32);
      let cond_check = *op_iter.next().unwrap();
      let cond_comp = op_iter.next().unwrap().parse::<i32>().unwrap();
      let pass = match cond_check {
        ">" => cond_reg > cond_comp,
        "<" => cond_reg < cond_comp,
        ">=" => cond_reg >= cond_comp,
        "<=" => cond_reg <= cond_comp,
        "==" => cond_reg == cond_comp,
        "!=" => cond_reg != cond_comp,
        _ => false
      };
      if pass {
        let current = registers.get(&target_reg.to_owned()).unwrap_or(&0i32);
        let next = match target_op {
          "inc" => current + target_change,
          "dec" => current - target_change,
          _ => *current
        };
        registers.insert(target_reg.to_string(), next);
      }
    });
  *registers.values().max().unwrap()
}

#[wasm_bindgen]
pub fn part_two(input: String) -> i32 {
  let mut registers: HashMap<String, i32> = HashMap::new();
  let mut max = 0i32;
  input.lines()
    .map(|ln| ln.split_whitespace().collect::<Vec<_>>())
    .for_each(|operations| {
      let mut op_iter = operations.iter();
      let target_reg = *op_iter.next().unwrap();
      let target_op = *op_iter.next().unwrap();
      let target_change = op_iter.next().unwrap().parse::<i32>().unwrap();
      op_iter.next();
      let cond_reg = *registers.get(op_iter.next().unwrap().to_owned()).unwrap_or(&0i32);
      let cond_check = *op_iter.next().unwrap();
      let cond_comp = op_iter.next().unwrap().parse::<i32>().unwrap();
      let pass = match cond_check {
        ">" => cond_reg > cond_comp,
        "<" => cond_reg < cond_comp,
        ">=" => cond_reg >= cond_comp,
        "<=" => cond_reg <= cond_comp,
        "==" => cond_reg == cond_comp,
        "!=" => cond_reg != cond_comp,
        _ => false
      };
      if pass {
        let current = registers.get(&target_reg.to_owned()).unwrap_or(&0i32);
        let next = match target_op {
          "inc" => current + target_change,
          "dec" => current - target_change,
          _ => *current
        };
        if max < next {
          max = next;
        }
        registers.insert(target_reg.to_string(), next);
      }
    });
  max
}

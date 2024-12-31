//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]

#[path = "../../utils/main.rs"]
mod utils;

use utils::*;
use wasm_bindgen::prelude::*;
// use regex::regex;
use web_sys::console;
use std::collections::HashMap;
// use std::collections::HashSet;
// use std::collections::VecDeque;
enum GateWire {
  Wire(u8),
  And(String, String),
  Xor(String, String),
  Or(String,String)
}

impl GateWire {
  fn get_output(&self, wires: &HashMap<String, GateWire>) -> u8 {
    match self {
      GateWire::Wire(signal) => signal.to_owned(),
      GateWire::And(a, b) => {
        let a = wires.get(a.as_str()).unwrap();
        let b = wires.get(b.as_str()).unwrap();
        a.get_output(wires) & b.get_output(wires)
      },
      GateWire::Xor(a, b) => {
        let a = wires.get(a.as_str()).unwrap();
        let b = wires.get(b.as_str()).unwrap();
        a.get_output(wires) ^ b.get_output(wires)
      },
      GateWire::Or(a, b) => {
        let a = wires.get(a.as_str()).unwrap();
        let b = wires.get(b.as_str()).unwrap();
        a.get_output(wires) | b.get_output(wires)
      }
    }
  }
}
#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> u64 {
  let mut wire_map = HashMap::<String, GateWire>::new();

  let (wires, gates) = input.split_once("\n\n").unwrap();
  wires.lines()
    .filter_map(|line| line.split_once(": "))
    .for_each(|(name, signal)| {
      wire_map.insert(
        name.to_string(),
        GateWire::Wire(signal.parse::<u8>().unwrap())
      );
    });
  gates.lines()
    .map(|line|
      line.split_whitespace().collect::<Vec<_>>()
    ).for_each(|parts| {
      let a = parts[0].to_string();
      let b = parts[2].to_string();
      let out = parts[4].to_string();
      let gate = match parts[1] {
        "AND" => GateWire::And(a, b),
        "XOR" => GateWire::Xor(a, b),
        "OR" => GateWire::Or(a, b),
        _ => unreachable!()
      };
      wire_map.insert(out, gate);
    });
  let mut output = 0u64;
  for i in 0..100 {
    let key = format!("z{i:0>2}");
    if let Some(wire) = wire_map.get(&key) {
      output |= (wire.get_output(&wire_map) as u64) << i;
    } else {
      break;
    }
  }
  output
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> String {
  let mut wire_map = HashMap::<String, GateWire>::new();

  let (wires, gates) = input.split_once("\n\n").unwrap();
  wires.lines()
    .filter_map(|line| line.split_once(": "))
    .for_each(|(name, signal)| {
      wire_map.insert(
        name.to_string(),
        GateWire::Wire(signal.parse::<u8>().unwrap())
      );
    });
  gates.lines()
    .map(|line|
      line.split_whitespace().collect::<Vec<_>>()
    ).for_each(|parts| {
      let a = parts[0].to_string();
      let b = parts[2].to_string();
      let out = parts[4].to_string();
      let gate = match parts[1] {
        "AND" => GateWire::And(a, b),
        "XOR" => GateWire::Xor(a, b),
        "OR" => GateWire::Or(a, b),
        _ => unreachable!()
      };
      wire_map.insert(out, gate);
    });
  let mut output = 0u64;
  for i in 0..100 {
    let key = format!("z{i:0>2}");
    if let Some(wire) = wire_map.get(&key) {
      output |= (wire.get_output(&wire_map) as u64) << i;
    } else {
      break;
    }
  }
  let mut x = 0u64;
  for i in 0..100 {
    let key = format!("x{i:0>2}");
    if let Some(wire) = wire_map.get(&key) {
      x |= (wire.get_output(&wire_map) as u64) << i;
    } else {
      break;
    }
  }
  let mut y = 0u64;
  for i in 0..100 {
    let key = format!("y{i:0>2}");
    if let Some(wire) = wire_map.get(&key) {
      y |= (wire.get_output(&wire_map) as u64) << i;
    } else {
      break;
    }
  }
  format!("{x} + {y} = {output}\n  should be {}\n  diff: {:0>44b}", x + y, x ^ y)
}

#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-24.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 0));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-24.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 0));
    }
}

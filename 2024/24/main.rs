//! ```cargo
//! [dependencies]
//! ```
#![feature(test, let_chains)]

use wasm_bindgen::prelude::*;
use std::collections::{HashMap, HashSet};

#[derive(Debug)]
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
  fn has_broken(&self, name: &str, wires: &HashMap<String, GateWire>) -> Option<String> {
    if name.starts_with("z") {
      return match self {
        GateWire::Xor(a, b) => {
          if name == "z00" {
            if a != "x00" || b != "y00" {
              Some("z00".to_string())
            } else {
              None
            }
          } else {
            if a.starts_with("x") || a.starts_with("y")
              || b.starts_with("x") || b.starts_with("y") {
              Some(name.to_string())
            } else {
              None
            }
          }
        },
        GateWire::Or(_, _) => {
          if name != "z45" {
            Some(name.to_string())
          } else {
            None
          }
        },
        _ =>  {
          Some(name.to_string())}
      }
    }
    return match self {
      GateWire::Wire(_) => None,
      GateWire::Xor(a, b) => {
        if let Some(GateWire::Xor(_,_)) = wires.get(a) && let Some(GateWire::Or(_,_)) = wires.get(b) {
            Some(name.to_string())
        } else if let Some(GateWire::Or(_,_)) = wires.get(a) && let Some(GateWire::Xor(_,_)) = wires.get(b) {
            Some(name.to_string())
        } else {
         None
        }
      },
      GateWire::And(a, b) => {
        if let Some(GateWire::And(x, _)) = wires.get(a) {
          if x != "x00" {
            Some(a.to_string())
          } else {
            None
          }
        } else if let Some(GateWire::And(x, _)) = wires.get(b) {
          if x != "x00" {
            Some(b.to_string())
          } else {
            None
          }
        } else {
         None
        }
      },
      GateWire::Or(a, b) => {
        match wires.get(a) {
          Some(GateWire::And(_, _)) => match wires.get(b) {
            Some(GateWire::And(_, _)) => None,
            _ => Some(b.to_string())
          },
          _ => Some(a.to_string())
        }
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
    let mut broken = wire_map.iter()
    .filter_map(|(name, gate)| gate.has_broken(name, &wire_map))
    .collect::<HashSet<_>>().into_iter().collect::<Vec<_>>();
  broken.sort();
  broken.join(",")
}

#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-24.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 50_411_513_338_638));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-24.txt").trim();
        b.iter(move || assert_eq!(part_two(input), "gfv,hcm,kfs,tqm,vwr,z06,z11,z16".to_string()));
    }
}

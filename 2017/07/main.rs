//! ```cargo
//! [dependencies]
//! ```

use wasm_bindgen::prelude::*;
use std::collections::{HashMap, HashSet};

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: String) -> String {
  let towers = input.lines().map(|ln| {
    let names = regex::Regex::new(r"[a-z]+").unwrap().captures_iter(ln).filter_map(|cap| cap.get(0)).map(|ma| ma.as_str().to_owned()).collect::<Vec<_>>();
    let weight = regex::Regex::new(r"\d+").unwrap().captures(ln).unwrap().get(0).unwrap().as_str().parse::<usize>().unwrap();
    Tower {
      name: names.iter().nth(0).unwrap().to_string(),
      weight,
      supported: names.iter().skip(1).map(|name| name.to_owned()).collect(),
    }
  }).collect::<Vec<_>>();
  let all_towers = towers.iter().map(|tower| tower.name.clone()).collect::<HashSet<_>>();
  let supported_towers = towers.iter().flat_map(|tower| tower.supported.clone()).collect::<HashSet<_>>();
  all_towers.difference(&supported_towers).nth(0).unwrap().to_string()
}

#[derive(Clone)]
struct Tower {
  name: String,
  weight: usize,
  supported: Vec<String>,
}

impl Tower {
  fn get_total_weight(&self, towers: &HashMap<String, Tower>) -> usize {
    self.weight + self.supported.iter().map(|name| towers.get(name).unwrap().get_total_weight(towers)).sum::<usize>()
  }
  fn is_unbalanced(&self, towers: &HashMap<String, Tower>) -> bool {
    let mut subtower_weights = self.supported.iter().map(|name| towers.get(name).unwrap().get_total_weight(towers));
    if let Some(head) = subtower_weights.next() {
      subtower_weights.any(|n| n != head)
    } else {
      false
    }
  }
}

#[wasm_bindgen]
pub fn part_two(input: String) -> usize {
  let towers = input.lines().map(|ln| {
    let names = regex::Regex::new(r"[a-z]+").unwrap().captures_iter(ln).filter_map(|cap| cap.get(0)).map(|ma| ma.as_str().to_owned()).collect::<Vec<_>>();
    let weight = regex::Regex::new(r"\d+").unwrap().captures(ln).unwrap().get(0).unwrap().as_str().parse::<usize>().unwrap();
    Tower {
      name: names.iter().nth(0).unwrap().to_string(),
      weight,
      supported: names.iter().skip(1).map(|name| name.to_owned()).collect(),
    }
  }).collect::<Vec<_>>();
  let tower_map = towers.iter().map(|tower| (tower.name.to_string(), tower.clone())).collect::<HashMap<_,_>>();
  let total_weights = towers.iter().map(|tower| (tower.name.to_string(), tower.get_total_weight(&tower_map))).collect::<HashMap<_,_>>();
  let mut unbalanced = towers.iter().filter(|tower| tower.is_unbalanced(&tower_map)).collect::<Vec<_>>();
  unbalanced.sort_by_key(|a| total_weights.get(&a.name).unwrap());
  let smallest_imbalance = unbalanced.get(0).unwrap();
  let children = smallest_imbalance.supported.iter().filter_map(|name| tower_map.get(name)).collect::<Vec<_>>();
  let min_child = children.iter().min_by_key(|child| total_weights.get(&child.name).unwrap()).unwrap();
  let max_child = children.iter().max_by_key(|child| total_weights.get(&child.name).unwrap()).unwrap();
  let diff = total_weights.get(&max_child.name).unwrap() - total_weights.get(&min_child.name).unwrap();
  if children.iter().filter_map(|child| total_weights.get(&child.name)).filter(|weight| weight == &total_weights.get(&min_child.name).unwrap()).take(2).count() > 1 {
    max_child.weight - diff
  } else {
    min_child.weight + diff
  }
}

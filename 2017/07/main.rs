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
pub fn part_one(input: String) -> String {
  let towers = input.lines().map(|ln| regex::Regex::new(r"^\w+").unwrap().captures(ln).unwrap().get(0).unwrap().as_str().to_owned()).collect::<Vec<_>>();
  let held = input.lines().flat_map(|ln| regex::Regex::new(r"[a-z]+").unwrap().captures_iter(ln).skip(1).collect::<Vec<_>>()).filter_map(|caps| caps.get(0)).map(|cap| cap.as_str().to_owned()).collect::<Vec<_>>();
  towers.iter().find(|name| held.iter().all(|other| &other != name)).unwrap().to_owned()
}

#[derive(Clone)]
struct Tower {
  name: String,
  weight: usize,
  supported: Vec<String>,
}

impl Tower {
  fn get_total_weight(&self, towers: &std::collections::HashMap<String, Tower>) -> usize {
    self.weight + self.supported.iter().map(|name| towers.get(name).unwrap().get_total_weight(towers)).sum::<usize>()
  }
  fn is_unbalanced(&self, towers: &std::collections::HashMap<String, Tower>) -> bool {
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
  let mut tower_map = std::collections::HashMap::new();
  towers.iter().for_each(|tower| {
    tower_map.insert(tower.name.to_string(), tower.clone());
  });
  let mut unbalanced_towers = towers.iter().filter(|tower| tower.is_unbalanced(&tower_map)).collect::<Vec<_>>();
  unbalanced_towers.sort_by(|a,b| a.get_total_weight(&tower_map).partial_cmp(&b.get_total_weight(&tower_map)).unwrap());
  let mut tower_iter = unbalanced_towers.iter();
  if let Some(first) = tower_iter.next() {
    if let Some(second) = tower_iter.next() {
      todo!()
    }
  }
  0
}

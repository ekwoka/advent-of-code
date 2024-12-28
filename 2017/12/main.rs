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
pub fn part_one(input: String) -> usize {
  let mut connections: HashMap<usize, HashSet<usize>> = HashMap::new();
  let bindings = regex::Regex::new(r"\d+").unwrap();
  input.lines().map(|line| bindings.captures_iter(line).map(|caps| caps.extract::<0>()).filter_map(|(cap,_)| cap.parse::<usize>().ok()).collect::<Vec<_>>())
  .for_each(|ids| {
    let sender = ids[0];
    if !connections.contains_key(&sender) {
        connections.insert(sender, HashSet::new());
      }
    let id_connections = connections.get_mut(&sender).unwrap();
    for id in ids.iter() {
      id_connections.insert(*id);
    }
    ids.iter().skip(1).for_each(|receiver| {
      if !connections.contains_key(receiver) {
        connections.insert(*receiver, HashSet::new());
      }
      let id_connections = connections.get_mut(receiver).unwrap();
      id_connections.insert(sender);
    })
  });
  let mut stack = vec![0usize];
  let mut found: HashSet<usize> = HashSet::new();
  while let Some(id) = stack.pop() {
    let connections = connections.get(&id).unwrap();
    let previously_found = found.clone();
    let unvisited = connections.difference(&previously_found).collect::<Vec<_>>();
    for id in unvisited {
      found.insert(*id);
      stack.push(*id);
    }
  }
  found.len()
}

#[wasm_bindgen]
pub fn part_two(input: String) -> usize {
  let mut connections: HashMap<usize, HashSet<usize>> = HashMap::new();
  let bindings = regex::Regex::new(r"\d+").unwrap();
  input.lines().map(|line| bindings.captures_iter(line).map(|caps| caps.extract::<0>()).filter_map(|(cap,_)| cap.parse::<usize>().ok()).collect::<Vec<_>>())
  .for_each(|ids| {
    let sender = ids[0];
    if !connections.contains_key(&sender) {
        connections.insert(sender, HashSet::new());
      }
    let id_connections = connections.get_mut(&sender).unwrap();
    for id in ids.iter() {
      id_connections.insert(*id);
    }
    ids.iter().skip(1).for_each(|receiver| {
      if !connections.contains_key(receiver) {
        connections.insert(*receiver, HashSet::new());
      }
      let id_connections = connections.get_mut(receiver).unwrap();
      id_connections.insert(sender);
    })
  });
  let all_ids = connections.keys().cloned().collect::<Vec<_>>();
  let mut found: HashSet<usize> = HashSet::new();
  let mut groups = 0;
  for id in all_ids {
    if found.contains(&id) {
      continue;
    }
    groups += 1;
    let mut stack = vec![id];
    while let Some(id) = stack.pop() {
      let connections = connections.get(&id).unwrap();
      let previously_found = found.clone();
      let unvisited = connections.difference(&previously_found).collect::<Vec<_>>();
      for id in unvisited {
        found.insert(*id);
        stack.push(*id);
      }
    }
  }
  groups
}

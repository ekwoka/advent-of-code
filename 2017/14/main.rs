//! ```cargo
//! [dependencies]
//! ```
#![feature(ascii_char)]
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: String) -> usize {
  (0..128)
    .map(|n| format!("{}-{}", &input, n))
    .map(knot_hash)
    .flat_map(|r| r.chars().filter_map(|ch| u8::from_str_radix(ch.to_string().as_str(), 16).ok()).flat_map(|n| format!("{:0>4b}", n).chars().collect::<Vec<_>>()).collect::<Vec<_>>())
    .filter(|c| *c == '1')
    .count()
}

#[wasm_bindgen]
pub fn part_two(input: String) -> usize {
  let mut used_blocks: std::collections::HashMap<Vec2, usize> = (0..128)
    .map(|n| format!("{}-{}", &input, n))
    .map(knot_hash)
    .flat_map(|r| r.chars().filter_map(|ch| u8::from_str_radix(ch.to_string().as_str(), 16).ok()).flat_map(|n| format!("{:0>4b}", n).chars().collect::<Vec<_>>()).collect::<Vec<_>>())
    .enumerate()
    .filter(|(_,c)| *c == '1')
    .map(|(i,_)| (Vec2(i as i16 % 128i16, i as i16 / 128i16), 0usize)).collect::<_>();

  let used_vecs = (0i16..128i16)
    .flat_map(|x| (0i16..128i16)
    .map(move |y| Vec2(x.clone(),y)))
    .filter(|v| used_blocks.contains_key(&v)).collect::<Vec<_>>();

  let neighbors = vec![Vec2(1,0), Vec2(0,1), Vec2(-1, 0), Vec2(0,-1)];

  let mut group = 1usize;
  for vec in used_vecs {
    if used_blocks.get(&vec).unwrap_or(&1) != &0usize {
      continue
    }
    let mut stack = vec![vec];
    while let Some(pos) = stack.pop() {
      used_blocks.insert(pos.clone(), group.clone());
      neighbors.iter().map(|n| pos.add(n)).filter(|v| used_blocks.get(v).and_then(|u| match u {
        0 => Some(u),
        _ => None
      }).is_some()).for_each(|v| stack.push(v));
    }
    group += 1;
  }
  group - 1usize
}

#[derive(Eq, PartialEq, Clone, Copy)]
struct Vec2(i16, i16);

impl Vec2 {
  fn add(&self, rhs: &Vec2) -> Vec2 {
    Vec2(self.0 + rhs.0, self.1 + rhs.1)
  }
}

impl std::hash::Hash for Vec2 {
  fn hash<H>(&self, hasher: &mut H) where H: std::hash::Hasher, {
    format!("{},{}",self.0, self.1).hash(hasher)
  }
}

fn knot_hash(input: String) -> String {
  let lengths = input.as_ascii().expect("Input to be only ASCII characters").iter().map(|ch| ch.to_u8() as usize).chain([17, 31, 73, 47, 23]).collect::<Vec<_>>();

  let mut nodes: [usize; 256] = (0..256).collect::<Vec<_>>().try_into().expect("Hard Coded Sizes");
  let position_lengths = std::iter::repeat_n(lengths.clone(), 64).flatten()
  .zip(0..).scan(0usize,|state, (length,skip)| {
    let position = *state;
    *state = position + length + skip;
    Some((position,length))
  });
  for (start, length) in position_lengths {
    for i in 0..length/2 {
      let a = (start + i) % 256;
      let b = (start + length - 1 - i) % 256;
      let temp = nodes[a];
      nodes[a] = nodes[b];
      nodes[b] = temp;
    }
  }
  nodes.chunks(16).filter_map(|chunk| chunk.iter().map(|n| n.to_owned()).reduce(|a,b| a ^ b)).map(|n| format!("{:0>2x}",n)).collect()
}

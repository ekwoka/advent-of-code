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
pub fn part_one(input: String, size: usize) -> usize {
  let position_lengths = input.split(',').map(|len| len.parse::<usize>().expect("Input to be valid")).zip(0..).scan(0usize,|state, (length,skip)| {
    let position = *state;
    *state = position + length + skip;
    Some((position,length))
  });
  let mut nodes: [usize; 256] = (0..size).chain(0..256).take(256).collect::<Vec<_>>().try_into().expect("Hard Coded to 256");
  for (start, length) in position_lengths {
    for i in 0..length/2 {
      let a = (start + i) % size;
      let b = (start + length - 1 - i) % size;
      let temp = nodes[a];
      nodes[a] = nodes[b];
      nodes[b] = temp;
    }
  }
  nodes[0] * nodes[1]
}
#[wasm_bindgen]
pub fn part_two(input: String) -> String {
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

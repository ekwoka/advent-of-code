use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: String) -> f64 {
  let mut pixels: Vec<u8> = (0..(50*6)).map(|_| 0).collect();
  input.lines().for_each(|line| {
    if line.starts_with("rect") {
      let mut parts = line.split(" ");
      let dimensions = parts.nth(1).unwrap().split("x");
      let dimensions = dimensions.map(|val| val.parse::<usize>().unwrap()).collect::<Vec<usize>>();
      for y in 0..dimensions[1] {
        for x in 0..dimensions[0] {
          pixels[y * 50 + x] = 1;
        }
      }
    } else if line.starts_with("rotate row") {
      let mut parts = line.split(" ");
      let row = parts.nth(2).unwrap().split("=").nth(1).unwrap().parse::<usize>().unwrap();
      let amount = parts.nth(1).unwrap().parse::<usize>().unwrap();
      let mut new_row = vec![0; 50];
      for x in 0..50 {
        new_row[(x + amount) % 50] = pixels[row * 50 + x];
      }
      for x in 0..50 {
        pixels[row * 50 + x] = new_row[x];
      }
    } else if line.starts_with("rotate column") {
      let mut parts = line.split(" ");
      let column = parts.nth(2).unwrap().split("=").nth(1).unwrap().parse::<usize>().unwrap();
      let amount = parts.nth(1).unwrap().parse::<usize>().unwrap();
      let mut new_column = vec![0; 6];
      for y in 0..6 {
        new_column[(y + amount) % 6] = pixels[y * 50 + column];
      }
      for y in 0..6 {
        pixels[y * 50 + column] = new_column[y];
      }
    }
  });
  return pixels.into_iter().filter(|val| *val == 1 as u8).count() as f64;
}

#[wasm_bindgen]
pub fn part_two(input: String) -> String {
  let mut pixels: Vec<u8> = (0..(50*6)).map(|_| 0).collect();
  input.lines().for_each(|line| {
    if line.starts_with("rect") {
      let mut parts = line.split(" ");
      let dimensions = parts.nth(1).unwrap().split("x");
      let dimensions = dimensions.map(|val| val.parse::<usize>().unwrap()).collect::<Vec<usize>>();
      for y in 0..dimensions[1] {
        for x in 0..dimensions[0] {
          pixels[y * 50 + x] = 1;
        }
      }
    } else if line.starts_with("rotate row") {
      let mut parts = line.split(" ");
      let row = parts.nth(2).unwrap().split("=").nth(1).unwrap().parse::<usize>().unwrap();
      let amount = parts.nth(1).unwrap().parse::<usize>().unwrap();
      let mut new_row = vec![0; 50];
      for x in 0..50 {
        new_row[(x + amount) % 50] = pixels[row * 50 + x];
      }
      for x in 0..50 {
        pixels[row * 50 + x] = new_row[x];
      }
    } else if line.starts_with("rotate column") {
      let mut parts = line.split(" ");
      let column = parts.nth(2).unwrap().split("=").nth(1).unwrap().parse::<usize>().unwrap();
      let amount = parts.nth(1).unwrap().parse::<usize>().unwrap();
      let mut new_column = vec![0; 6];
      for y in 0..6 {
        new_column[(y + amount) % 6] = pixels[y * 50 + column];
      }
      for y in 0..6 {
        pixels[y * 50 + column] = new_column[y];
      }
    }
  });
  let pixels = pixels.into_iter().map(|v| match v {
    0 =>
    " ",
    1 => "#",
    _ => panic!("Invalid pixel value")
  });
  let mut rows: Vec<String> = Vec::new();
  for i in 0..6 {
    rows.push(pixels.clone().skip(50*i).take(50).collect::<Vec<&str>>().join(""));
  };
  rows.join("\n")
}

//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]
#[path = "../../utils/main.rs"]
mod utils;
use utils::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: String) -> i32 {
    let start = input.parse::<i32>().unwrap();
    if start == 1 {
        return 0;
    }
    let mut upper = (start as f32).sqrt().ceil() as i32;
    if upper % 2 == 0 {
        upper += 1
    }
    let lower = upper - 2;
    let diff = upper.pow(2) - lower.pow(2);
    let side = diff / 4;
    let offset = (((start - lower.pow(2)) % side) - side / 2).abs();
    side / 2 + offset
}

#[wasm_bindgen]
pub fn part_two(input: String) -> i32 {
    let target = input.parse::<i32>().unwrap();
    let mut values = std::collections::HashMap::new();
    values.insert(Vec2::ZERO.to_string(), 1);
    let mut position = Vec2::ZERO;
    let mut direction = Vec2::Y;
    for i in (1i32..).step_by(2) {
        let side = ((i + 2i32).pow(2) - i.pow(2)) / 4;
        for j in 0..4 {
            for k in 0..side {
                position = position + direction;
                let value = Vec2::NEIGHBORS
                    .into_iter()
                    .map(|n| n + position)
                    .filter_map(|vec| values.get(vec.to_string().as_str()))
                    .sum();
                if value >= target {
                    return value;
                }
                values.insert(position.to_string(), value);
                if j == 0 && k == 0 {
                    direction = direction.rotate_right()
                }
            }
            if j != 3 {
                direction = direction.rotate_right()
            }
        }
    }
    -1
}

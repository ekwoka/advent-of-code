//! ```cargo
//! [dependencies]
//! itertools = "0.14.0"
//! ```

use itertools::Itertools;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: String) -> u32 {
    let sum_of_sequential_values = input
        .chars()
        .tuple_windows::<(_, _)>()
        .filter(|(a, b)| a == b)
        .map(|(a, _)| a.to_digit(10).unwrap())
        .sum();
    if input.chars().next() == input.chars().last() {
        sum_of_sequential_values + input.chars().next().and_then(|d| d.to_digit(10)).unwrap()
    } else {
        sum_of_sequential_values
    }
}

#[wasm_bindgen]
pub fn part_two(input: String) -> u32 {
    let halfway = input.chars().count() / 2;
    let wrapped = input.chars().cycle().take(halfway * 3).skip(halfway);
    input
        .chars()
        .zip(wrapped)
        .filter(|(a, b)| a == b)
        .map(|(a, _)| a.to_digit(10).unwrap())
        .sum()
}

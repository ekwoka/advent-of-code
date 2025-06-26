//! ```cargo
//! [dependencies]
//! ```
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: String) -> usize {
    input
        .lines()
        .map(|line| {
            regex::Regex::new(r"\d+")
                .unwrap()
                .captures_iter(line)
                .map(|caps| caps.extract::<0>())
                .map(|(n, _)| n.parse::<usize>().unwrap())
                .collect()
        })
        .map(|nums: Vec<usize>| {
            let min = nums.clone().into_iter().min().unwrap();
            let max = nums.into_iter().max().unwrap();
            max - min
        })
        .sum()
}

#[wasm_bindgen]
pub fn part_two(input: String) -> usize {
    input
        .lines()
        .map(|line| {
            regex::Regex::new(r"\d+")
                .unwrap()
                .captures_iter(line)
                .map(|caps| caps.extract::<0>())
                .map(|(n, _)| n.parse::<usize>().unwrap())
                .collect::<Vec<usize>>()
        })
        .map(|mut nums: Vec<usize>| {
            nums.sort();
            nums.clone()
                .into_iter()
                .flat_map(|a| nums.clone().into_iter().map(move |b| (a, b)))
                .filter(|(a, b)| a != b && b.is_multiple_of(a.to_owned()))
                .map(|(a, b)| b / a)
                .next()
                .unwrap()
        })
        .sum()
}

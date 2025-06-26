//! ```cargo
//! [dependencies]
//! fancy-regex = "0.14.0"
//! ```

use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: String) -> usize {
    let regex = fancy_regex::Regex::new(r".*?(\d+) positions.*?position (\d+).").unwrap();
    let discs = input
        .lines()
        .map(|line| {
            let captures = regex.captures(line).ok().flatten().unwrap();
            (
                captures.get(1).unwrap().as_str().parse().unwrap(),
                captures.get(2).unwrap().as_str().parse().unwrap(),
            )
        })
        .collect::<Vec<(usize, usize)>>();
    (0..)
        .find(|time| {
            discs
                .iter()
                .enumerate()
                .all(|(i, (positions, start))| (start + time + i + 1) % positions == 0)
        })
        .unwrap()
}

#[wasm_bindgen]
pub fn part_two(input: String) -> usize {
    let regex = fancy_regex::Regex::new(r".*?(\d+) positions.*?position (\d+).").unwrap();
    let mut discs = input
        .lines()
        .map(|line| {
            let captures = regex.captures(line).ok().flatten().unwrap();
            (
                captures.get(1).unwrap().as_str().parse().unwrap(),
                captures.get(2).unwrap().as_str().parse().unwrap(),
            )
        })
        .collect::<Vec<(usize, usize)>>();
    discs.push((11, 0));
    (0..)
        .find(|time| {
            discs
                .iter()
                .enumerate()
                .all(|(i, (positions, start))| (start + time + i + 1) % positions == 0)
        })
        .unwrap()
}

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
    let mut banks = regex::Regex::new(r"\d+")
        .expect("hardcoded regex should be valid")
        .captures_iter(input.as_str())
        .map(|bank| {
            bank.get(0)
                .expect("ever capture to have a value")
                .as_str()
                .parse::<usize>()
                .expect("Input to be valid")
        })
        .collect::<Vec<_>>();
    let mut seen = std::collections::HashSet::new();
    seen.insert(
        banks
            .iter()
            .map(|b| b.to_string())
            .collect::<Vec<_>>()
            .join(" "),
    );
    for i in 1.. {
        let max = banks
            .clone()
            .iter()
            .max()
            .expect("numbers to exist")
            .to_owned();
        let idx: usize = banks
            .iter()
            .position(|b| b == &max)
            .expect("max to exist in vec");
        banks[idx] = 0;
        for j in 1..max + 1 {
            let idx = (idx + j) % banks.len();
            banks[idx] += 1;
        }
        if seen.contains(
            banks
                .iter()
                .map(|b| b.to_string())
                .collect::<Vec<_>>()
                .join(" ")
                .as_str(),
        ) {
            return i;
        }
        seen.insert(
            banks
                .iter()
                .map(|b| b.to_string())
                .collect::<Vec<_>>()
                .join(" "),
        );
    }
    0
}

#[wasm_bindgen]
pub fn part_two(input: String) -> usize {
    let mut banks = regex::Regex::new(r"\d+")
        .expect("hardcoded regex should be valid")
        .captures_iter(input.as_str())
        .map(|bank| {
            bank.get(0)
                .expect("ever capture to have a value")
                .as_str()
                .parse::<usize>()
                .expect("Input to be valid")
        })
        .collect::<Vec<_>>();
    let mut seen = std::collections::HashMap::new();
    seen.insert(
        banks
            .iter()
            .map(|b| b.to_string())
            .collect::<Vec<_>>()
            .join(" "),
        0,
    );
    for i in 1.. {
        let max = banks
            .clone()
            .iter()
            .max()
            .expect("numbers to exist")
            .to_owned();
        let idx: usize = banks
            .iter()
            .position(|b| b == &max)
            .expect("max to exist in vec");
        banks[idx] = 0;
        for j in 1..max + 1 {
            let idx = (idx + j) % banks.len();
            banks[idx] += 1;
        }
        if seen.contains_key(
            banks
                .iter()
                .map(|b| b.to_string())
                .collect::<Vec<_>>()
                .join(" ")
                .as_str(),
        ) {
            return i - seen
                .get(
                    banks
                        .iter()
                        .map(|b| b.to_string())
                        .collect::<Vec<_>>()
                        .join(" ")
                        .as_str(),
                )
                .expect("contained values to exist");
        }
        seen.insert(
            banks
                .iter()
                .map(|b| b.to_string())
                .collect::<Vec<_>>()
                .join(" "),
            i,
        );
    }
    0
}

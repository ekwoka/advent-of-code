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
        .map(|line| line.split(" ").collect::<Vec<_>>())
        .filter_map(|words| {
            let mut known = vec![];
            for next in words.into_iter() {
                if known.clone().into_iter().any(|k| k == next) {
                    return None;
                }
                known.push(next);
            }
            Some(())
        })
        .count()
}

#[wasm_bindgen]
pub fn part_two(input: String) -> usize {
    input
        .lines()
        .map(|line| line.split(" ").collect::<Vec<_>>())
        .filter(|words| {
            let mut known: Vec<&str> = vec![];
            for next in words.iter() {
                for k in known.clone().into_iter() {
                    if &k == next {
                        return false;
                    }
                }
                for k in known.clone().into_iter() {
                    if k.len() != next.len() {
                        continue;
                    }
                    let mut k_chars = k.chars().collect::<Vec<_>>();
                    let mut n_chars = next.chars().collect::<Vec<_>>();
                    k_chars.sort();
                    n_chars.sort();
                    if k_chars
                        .into_iter()
                        .zip(n_chars.into_iter())
                        .all(|(a, b)| a == b)
                    {
                        return false;
                    }
                }
                known.push(next);
            }
            true
        })
        .count()
}

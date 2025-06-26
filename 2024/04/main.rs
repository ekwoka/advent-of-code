//! ```cargo
//! [dependencies]
//! ```
//! --- Day 4: Ceres Search ---
//! Part    Time       Rank
//!   1     00:28:04   5804
//!   2     00:35:46   4323
//!
//! We check the monitoring station for the Chief Historian
//! but a young Elf needs help with her word search!
#![feature(test)]
#[path = "../../utils/main.rs"]
mod utils;

use std::collections::HashMap;
use utils::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}

/// Part one consists of just finding XMAS arranged forwards and backwards
/// in all the cardinal directions
/// Here we search for either X or S and then only look in forward facing directions
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
    let mut letter_grid: HashMap<Vec2, char> = HashMap::new();
    input
        .lines()
        .enumerate()
        .flat_map(|(x, line)| {
            line.chars()
                .enumerate()
                .map(move |(y, ch)| (Vec2::new(x as i32, y as i32), ch))
        })
        .for_each(|(vec, ch)| {
            letter_grid.insert(vec, ch);
        });
    letter_grid
        .iter()
        .filter(|(_, ch)| **ch == 'X' || **ch == 'S')
        .flat_map(|(start, _)| {
            [
                Vec2::new(1, 0),
                Vec2::new(0, 1),
                Vec2::new(1, 1),
                Vec2::new(1, -1),
            ]
            .into_iter()
            .map(|step| {
                [*start]
                    .into_iter()
                    .chain((0..3).scan(*start, |pos, _| {
                        *pos = *pos + step;
                        Some(*pos)
                    }))
                    .filter_map(|vec| letter_grid.get(&vec))
                    .collect::<String>()
            })
        })
        .filter(|text| text == "XMAS" || text == "SAMX")
        .count()
}

/// We realize it's not looking for XMAS, but for MAS in an X shape!
/// So we now look for A and check the corresponding diagonals for a correct MAS
#[wasm_bindgen]
pub fn part_two(input: &str) -> usize {
    let mut letter_grid: HashMap<Vec2, char> = HashMap::new();
    input
        .lines()
        .enumerate()
        .flat_map(|(x, line)| {
            line.chars()
                .enumerate()
                .map(move |(y, ch)| (Vec2::new(x as i32, y as i32), ch))
        })
        .for_each(|(vec, ch)| {
            letter_grid.insert(vec, ch);
        });
    letter_grid
        .iter()
        .filter(|(_, ch)| **ch == 'A')
        .filter(|(start, _)| {
            let first = [Vec2::new(-1, -1), Vec2::new(0, 0), Vec2::new(1, 1)]
                .into_iter()
                .map(|step| **start + step)
                .filter_map(|vec| letter_grid.get(&vec))
                .collect::<String>();
            if first != "MAS" && first != "SAM" {
                false
            } else {
                let second = [Vec2::new(-1, 1), Vec2::new(0, 0), Vec2::new(1, -1)]
                    .into_iter()
                    .map(|step| **start + step)
                    .filter_map(|vec| letter_grid.get(&vec))
                    .collect::<String>();
                second == "MAS" || second == "SAM"
            }
        })
        .count()
}

#[cfg(test)]
mod tests {
    extern crate test;
    use super::*;
    use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-04.txt").trim();
        b.iter(move || part_one(input));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-04.txt").trim();
        b.iter(move || part_two(input));
    }
}

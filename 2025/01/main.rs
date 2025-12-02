//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]

use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
    input
        .lines()
        .map(|line| {
            (
                line.chars().next().unwrap(),
                line[1..].parse::<i32>().unwrap(),
            )
        })
        .scan(50i32, |state, (direction, distance)| {
            match direction {
                'R' => *state += distance,
                'L' => *state -= distance,
                _ => unreachable!(),
            }
            *state = (*state + 100) % 100;
            Some(*state)
        })
        .filter(|state| *state == 0)
        .count()
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> usize {
    input
        .lines()
        .flat_map(|line| {
            let direction = match line.chars().next().unwrap() {
                'R' => 1i32,
                'L' => -1i32,
                _ => unreachable!(),
            };
            let distance = line[1..].parse::<i32>().unwrap();
            (0..distance).map(move |_| direction)
        })
        .scan(50i32, |state, direction| {
            *state = (*state + direction + 100) % 100;
            Some(*state)
        })
        .filter(|state| *state == 0)
        .count()
}

#[cfg(test)]
mod tests {
    extern crate test;
    use super::*;
    use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-01.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 962));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-01.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 5782));
    }
}

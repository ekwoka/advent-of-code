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
pub fn part_two(input: &str) -> i32 {
    input
        .lines()
        .map(|line| {
            let distance = line[1..].parse::<i32>().unwrap();
            match line.chars().next().unwrap() {
                'R' => distance,
                'L' => -distance,
                _ => unreachable!(),
            }
        })
        .scan(50i32, |state, movement| {
            let mut cycles = (movement / 100).abs();
            let remaining = movement % 100;
            if *state != 0 {
                if remaining < 0 {
                    if remaining.abs() >= *state {
                        cycles += 1;
                    }
                } else {
                    if remaining >= (100 - *state) {
                        cycles += 1;
                    }
                }
            }
            *state = (*state + remaining + 100) % 100;
            Some(cycles)
        })
        .sum()
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

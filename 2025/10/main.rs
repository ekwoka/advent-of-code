//! ```cargo
//! [dependencies]
//! microlp = "0.2.11"
//! ```
#![feature(test)]

use microlp::{ComparisonOp, OptimizationDirection, Problem};
use regex::Regex;
use std::collections::{HashSet, VecDeque};
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
    let light_regex = Regex::new(r#"\[(.*?)\]"#).unwrap();
    let button_regex = Regex::new(r#"\((.*?)\)"#).unwrap();
    input
        .lines()
        .map(|line| {
            let lights = light_regex
                .captures(line)
                .unwrap()
                .get(1)
                .unwrap()
                .as_str()
                .chars()
                .enumerate()
                .map(|(i, c)| match c {
                    '#' => 1 << i,
                    _ => 0,
                })
                .fold(0, |acc, x| acc | x);
            let buttons = button_regex
                .captures_iter(line)
                .map(|c| {
                    let nums = c.get(1).unwrap().as_str();
                    nums.split(',')
                        .map(|d| d.parse::<usize>().unwrap())
                        .map(|i| 1 << i)
                        .fold(0, |acc, x| acc | x)
                })
                .collect::<Vec<usize>>();
            let mut visited = HashSet::<usize>::from([0]);
            let mut queue = VecDeque::from([(0, usize::MAX, 0usize)]);
            while let Some((state, prev, count)) = queue.pop_front() {
                if state == lights {
                    return count;
                }
                for (i, button) in buttons.iter().enumerate() {
                    if i == prev {
                        continue;
                    }
                    let new_state = state.clone() ^ button;
                    if visited.contains(&new_state) {
                        continue;
                    }
                    visited.insert(new_state.clone());
                    queue.push_back((new_state, i, count + 1));
                }
            }
            return 0;
        })
        .sum()
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> usize {
    let joltage_regex = Regex::new(r#"\{(.*?)\}"#).unwrap();
    let button_regex = Regex::new(r#"\((.*?)\)"#).unwrap();
    input
        .lines()
        .map(|line| {
            let joltages = joltage_regex
                .captures(line)
                .unwrap()
                .get(1)
                .unwrap()
                .as_str()
                .split(',')
                .map(|d| d.parse::<usize>().unwrap())
                .collect::<Vec<usize>>();
            let buttons = button_regex
                .captures_iter(line)
                .map(|c| {
                    let nums = c.get(1).unwrap().as_str();
                    nums.split(',')
                        .map(|d| d.parse::<usize>().unwrap())
                        .collect::<Vec<usize>>()
                })
                .collect::<Vec<Vec<usize>>>();

            let mut problem = Problem::new(OptimizationDirection::Minimize);

            let press_vars = (0..buttons.len())
                .map(|_| problem.add_integer_var(1.0, (0, i32::MAX)))
                .collect::<Vec<_>>();

            for (i, j) in joltages.iter().enumerate() {
                let expr = press_vars
                    .iter()
                    .clone()
                    .zip(buttons.clone())
                    .filter(|(_, b)| b.contains(&i))
                    .map(|(v, _)| (*v, 1.0f64));
                problem.add_constraint(expr, ComparisonOp::Eq, *j as f64);
            }
            problem
                .solve()
                .map(move |sol| sol.objective().round() as usize)
                .unwrap_or_default()
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
        let input = include_str!("../../node_modules/.aoc-cache/2025-10.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 432));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-10.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 18_011));
    }
}

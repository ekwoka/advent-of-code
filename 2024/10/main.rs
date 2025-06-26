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
    let map = input
        .lines()
        .map(|line| {
            line.chars()
                .map(|ch| ch.to_digit(10).unwrap())
                .collect::<Vec<_>>()
        })
        .collect::<Vec<_>>();
    let mut trail_heads = map
        .iter()
        .enumerate()
        .flat_map(|(y, row)| {
            row.iter()
                .enumerate()
                .filter(|(_, height)| **height == 0)
                .map(move |(x, height)| (x, y, x, y, *height))
        })
        .collect::<Vec<_>>();
    let mut paths: std::collections::HashSet<(usize, usize, usize, usize)> =
        std::collections::HashSet::new();
    while let Some((startx, starty, x, y, height)) = trail_heads.pop() {
        if height == 9 {
            paths.insert((startx, starty, x, y));
            continue;
        }
        if x > 0 && map[y][x - 1] == height + 1 {
            trail_heads.push((startx, starty, x - 1, y, height + 1));
        }
        if x < map[0].len() - 1 && map[y][x + 1] == height + 1 {
            trail_heads.push((startx, starty, x + 1, y, height + 1));
        }
        if y > 0 && map[y - 1][x] == height + 1 {
            trail_heads.push((startx, starty, x, y - 1, height + 1));
        }
        if y < map.len() - 1 && map[y + 1][x] == height + 1 {
            trail_heads.push((startx, starty, x, y + 1, height + 1));
        }
    }
    paths.len()
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> usize {
    let map = input
        .lines()
        .map(|line| {
            line.chars()
                .map(|ch| ch.to_digit(10).unwrap())
                .collect::<Vec<_>>()
        })
        .collect::<Vec<_>>();
    let mut trail_heads = map
        .iter()
        .enumerate()
        .flat_map(|(y, row)| {
            row.iter()
                .enumerate()
                .filter(|(_, height)| **height == 0)
                .map(move |(x, height)| (x, y, *height))
        })
        .collect::<Vec<_>>();
    let mut score = 0;
    while let Some((x, y, height)) = trail_heads.pop() {
        if height == 9 {
            score += 1;
            continue;
        }
        if x > 0 && map[y][x - 1] == height + 1 {
            trail_heads.push((x - 1, y, height + 1));
        }
        if x < map[0].len() - 1 && map[y][x + 1] == height + 1 {
            trail_heads.push((x + 1, y, height + 1));
        }
        if y > 0 && map[y - 1][x] == height + 1 {
            trail_heads.push((x, y - 1, height + 1));
        }
        if y < map.len() - 1 && map[y + 1][x] == height + 1 {
            trail_heads.push((x, y + 1, height + 1));
        }
    }
    score
}

#[cfg(test)]
mod tests {
    extern crate test;
    use super::*;
    use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-10.txt").trim();
        b.iter(move || part_one(input));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-10.txt").trim();
        b.iter(move || part_two(input));
    }
}

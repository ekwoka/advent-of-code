//! ```cargo
//! [dependencies]
//! ```
#![feature(test, iter_map_windows)]

#[path = "../../utils/main.rs"]
mod utils;

use utils::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> u64 {
    let tiles = input
        .lines()
        .map(|line| {
            let (x, y) = line.split_once(',').unwrap();
            Vec2::new(x.parse().unwrap(), y.parse().unwrap())
        })
        .collect::<Vec<Vec2>>();

    tiles
        .iter()
        .enumerate()
        .flat_map(|(i, tile)| {
            tiles.iter().skip(i + 1).map(move |other| {
                let dx = other.x - tile.x;
                let dy = other.y - tile.y;
                (dx.abs() as u64 + 1) * (dy.abs() as u64 + 1)
            })
        })
        .max()
        .unwrap_or(0)
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> u64 {
    let mut tiles = input
        .lines()
        .map(|line| {
            let (x, y) = line.split_once(',').unwrap();
            Vec2::new(x.parse().unwrap(), y.parse().unwrap())
        })
        .collect::<Vec<Vec2>>();

    let mut sorted_pairs = tiles
        .iter()
        .enumerate()
        .flat_map(|(i, tile)| {
            tiles.iter().skip(i + 1).map(move |other| {
                let dx = other.x - tile.x;
                let dy = other.y - tile.y;
                (
                    tile.min(other.clone()),
                    tile.max(other.clone()),
                    (dx.abs() as u64 + 1) * (dy.abs() as u64 + 1),
                )
            })
        })
        .collect::<Vec<_>>();

    tiles.push(tiles[0].clone());

    sorted_pairs.sort_by_key(|(_, _, distance)| *distance);
    sorted_pairs
        .into_iter()
        .rev()
        .filter(|(a, b, _)| {
            let (min, max) = (*a + Vec2::ONE, *b - Vec2::ONE);
            !tiles
                .iter()
                .cloned()
                .any(|point| point.min(max).max(min) == point)
                && !tiles
                    .iter()
                    .cloned()
                    .map_windows(|[sa, sb]| (sa.clone(), sb.clone()))
                    .any(|(sa, sb)| {
                        let seg = (sa.min(sb.clone()), sa.max(sb.clone()));
                        if seg.0.x == seg.1.x {
                            if !(a.x < seg.0.x && b.x > seg.0.x) {
                                false
                            } else {
                                if seg.1.y == a.y || seg.0.y == b.y {
                                    false
                                } else {
                                    let range = seg.0.y..=seg.1.y;
                                    range.contains(&a.y) || range.contains(&b.y)
                                }
                            }
                        } else {
                            if !(a.y < seg.0.y && b.y > seg.0.y) {
                                false
                            } else {
                                if seg.1.x == a.x || seg.0.x == b.x {
                                    false
                                } else {
                                    let range = seg.0.x..=seg.1.x;
                                    range.contains(&a.x) || range.contains(&b.x)
                                }
                            }
                        }
                    })
        })
        .map(|(_, _, distance)| distance)
        .next()
        .unwrap_or(0)
}

#[cfg(test)]
mod tests {
    extern crate test;
    use super::*;
    use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-09.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 4_765_757_080));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-09.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 1_498_673_376));
    }
}

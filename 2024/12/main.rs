//! ```cargo
//! [dependencies]
//! ```
//! --- Day 12: Garden Groups ---
//! Part    Time       Rank
//!   1     00:26:53   3041
//!   2     01:19:05   2738
//!
//! We need to help the elves order fencing to separate their crops!
//! They want to estimate the fence cost before making the order.
#![feature(test)]
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}

/// Part 1 requires getting all the edges of the different plant areas
/// So we do a simple flood fill from the first spot we hit of a new crop
/// As we fill, we update the fence count by how that space impacts borders
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
    let plots = input
        .lines()
        .map(|line| line.chars().collect::<Vec<_>>())
        .collect::<Vec<_>>();
    let mut visited = std::collections::HashSet::<(usize, usize)>::new();
    (0..plots.len())
        .flat_map(|y| (0..plots[0].len()).map(move |x| (y, x)))
        .filter_map(|coord| {
            if visited.contains(&coord) {
                return None;
            }
            let plant = plots[coord.0][coord.1];
            let mut contained = std::collections::HashSet::<(usize, usize)>::new();
            let mut perimeter = 0i32;
            let mut stack = vec![coord];
            while let Some((y, x)) = stack.pop() {
                if plots[y][x] != plant || contained.contains(&(y, x)) {
                    continue;
                }
                let mut sides = 4i32;
                if y > 0 {
                    if contained.contains(&(y - 1, x)) {
                        sides -= 2;
                    } else {
                        stack.push((y - 1, x));
                    }
                }
                if y < plots.len() - 1 {
                    if contained.contains(&(y + 1, x)) {
                        sides -= 2;
                    } else {
                        stack.push((y + 1, x));
                    }
                }
                if x > 0 {
                    if contained.contains(&(y, x - 1)) {
                        sides -= 2;
                    } else {
                        stack.push((y, x - 1));
                    }
                }
                if x < plots[0].len() - 1 {
                    if contained.contains(&(y, x + 1)) {
                        sides -= 2;
                    } else {
                        stack.push((y, x + 1));
                    }
                }
                perimeter += sides;
                contained.insert((y, x));
                visited.insert((y, x));
            }
            Some((contained.len(), perimeter as usize))
        })
        .map(|(area, perim)| area * perim)
        .sum()
}

/// Part 2 requires only counting each straight line of fences, not every unit of fencing
/// Here we do the flood fill, and then move through it counting just the vertical faces
/// Then merge them when possible into longer lengths, count the remaining, and double it (to account for horizontal faces)
#[wasm_bindgen]
pub fn part_two(input: &str) -> usize {
    let plots = input
        .lines()
        .map(|line| line.chars().collect::<Vec<_>>())
        .collect::<Vec<_>>();
    let mut visited = std::collections::HashSet::<(usize, usize)>::new();
    (0..plots.len())
        .flat_map(|y| (0..plots[0].len()).map(move |x| (y, x)))
        .filter_map(|coord| {
            if visited.contains(&coord) {
                return None;
            }
            let plant = plots[coord.0][coord.1];
            let mut contained = std::collections::HashSet::<(usize, usize)>::new();
            let mut stack = vec![coord];
            while let Some((y, x)) = stack.pop() {
                if plots[y][x] != plant || contained.contains(&(y, x)) {
                    continue;
                }
                if y > 0 {
                    stack.push((y - 1, x));
                }
                if y < plots.len() - 1 {
                    stack.push((y + 1, x));
                }
                if x > 0 {
                    stack.push((y, x - 1));
                }
                if x < plots[0].len() - 1 {
                    stack.push((y, x + 1));
                }
                contained.insert((y, x));
                visited.insert((y, x));
            }
            let mut vert_sides = Vec::<(usize, usize, usize)>::new();
            let mut edges = contained
                .clone()
                .iter()
                .flat_map(|(y, x)| {
                    let mut sides = Vec::<(usize, usize)>::new();
                    if *x == 0 || !contained.contains(&(*y, x - 1)) {
                        sides.push((*y, x * 2));
                    }
                    if !contained.contains(&(*y, x + 1)) {
                        sides.push((*y, (x * 2 + 1)));
                    }
                    sides
                })
                .collect::<Vec<_>>();
            edges.sort_by(|(a, _), (b, _)| a.cmp(b));
            edges.iter().for_each(|(y, x)| {
                let existing_idx = vert_sides
                    .iter()
                    .position(|side| side.0 == *x && (side.1 == y + 1 || side.2 == *y - 1));
                if let Some(index) = existing_idx {
                    let existing = vert_sides.get_mut(index).unwrap();
                    existing.1 = existing.1.min(*y);
                    existing.2 = existing.2.max(*y);
                } else {
                    vert_sides.push((*x, *y, *y))
                }
            });

            Some((contained.len(), vert_sides.len() * 2))
        })
        .map(|(area, sides)| area * sides)
        .sum()
}

#[cfg(test)]
mod tests {
    extern crate test;
    use super::*;
    use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-12.txt").trim();
        b.iter(move || part_one(input));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-12.txt").trim();
        b.iter(move || part_two(input));
    }
}

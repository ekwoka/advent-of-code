//! ```cargo
//! [dependencies]
//! ```
//! --- Day 15: Warehouse Woes ---
//! Not done live. Holiday family time.
//!
//! A food storage warehouse robot has gone wild, and is moving around
//! however it wants! We need to identify how it's movements impact the
//! items in the warehouse
#![feature(test)]
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}

/// Part 1 is a pretty simple simulation. We see how the robot will try to move
/// and scan forward to move the blocks in its path (if possible).
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
    let (grid, instructions) = input.split_once("\n\n").unwrap();
    let mut map = grid
        .lines()
        .map(|line| line.chars().collect::<Vec<_>>())
        .collect::<Vec<_>>();
    let mut robot = grid
        .lines()
        .enumerate()
        .flat_map(|(y, line)| {
            line.chars()
                .enumerate()
                .filter(|(_, ch)| ch == &'@')
                .map(move |(x, _)| (x as i32, y as i32))
        })
        .next()
        .unwrap();
    map[robot.1 as usize][robot.0 as usize] = '.';
    for movement in instructions.chars().map(|ch| match ch {
        '<' => (-1, 0),
        '^' => (0, -1),
        '>' => (1, 0),
        'v' => (0, 1),
        _ => (0, 0),
    }) {
        match map[(robot.1 + movement.1) as usize][(robot.0 + movement.0) as usize] {
            '#' => continue,
            '.' => {
                robot.0 += movement.0;
                robot.1 += movement.1;
            }
            'O' => {
                let mut marker = robot;
                'inner: loop {
                    marker.0 += movement.0;
                    marker.1 += movement.1;
                    if map[marker.1 as usize][marker.0 as usize] != 'O' {
                        break 'inner;
                    }
                }
                match map[marker.1 as usize][marker.0 as usize] {
                    '#' => continue,
                    '.' => {
                        map[marker.1 as usize][marker.0 as usize] = 'O';
                        robot.0 += movement.0;
                        robot.1 += movement.1;
                        map[robot.1 as usize][robot.0 as usize] = '.';
                    }
                    _ => (),
                }
            }
            _ => (),
        }
    }
    map.iter()
        .enumerate()
        .flat_map(|(y, row)| {
            row.iter()
                .enumerate()
                .filter(|(_, ch)| ch == &&'O')
                .map(move |(x, _)| y * 100 + x)
        })
        .sum()
}

/// Part 2 is a bit trickier, where the blocks are actually two spaces wide
/// Meaning you can't just do a forward scan, but a forward branching fill
/// to identify if there are any walls, and then update all the blocks.
#[wasm_bindgen]
pub fn part_two(input: &str) -> usize {
    let (grid, instructions) = input.split_once("\n\n").unwrap();
    let mut map = grid
        .lines()
        .map(|line| {
            line.chars()
                .flat_map(|ch| match ch {
                    '#' => ['#', '#'],
                    'O' => ['[', ']'],
                    ch => [ch, '.'],
                })
                .collect::<Vec<_>>()
        })
        .collect::<Vec<_>>();
    let mut robot = map
        .iter()
        .enumerate()
        .flat_map(|(y, line)| {
            line.iter()
                .enumerate()
                .filter(|(_, ch)| *ch == &'@')
                .map(move |(x, _)| (x as i32, y as i32))
        })
        .next()
        .unwrap();
    map[robot.1 as usize][robot.0 as usize] = '.';
    for movement in instructions.chars().map(|ch| match ch {
        '<' => (-1, 0),
        '^' => (0, -1),
        '>' => (1, 0),
        'v' => (0, 1),
        _ => (0, 0),
    }) {
        match map[(robot.1 + movement.1) as usize][(robot.0 + movement.0) as usize] {
            '#' => continue,
            '.' => {
                robot.0 += movement.0;
                robot.1 += movement.1;
            }
            '[' => {
                if let Some(positions) =
                    block_search((robot.0 + movement.0, robot.1 + movement.1), movement, &map)
                {
                    let mut visited = std::collections::HashSet::<(i32, i32)>::new();
                    positions.into_iter().for_each(|pos| {
                        if visited.contains(&pos) {
                            return;
                        }
                        visited.insert(pos);
                        map[(pos.1 + movement.1) as usize][(pos.0 + movement.0) as usize] =
                            map[pos.1 as usize][pos.0 as usize];
                        map[pos.1 as usize][pos.0 as usize] = '.';
                    });
                    robot.0 += movement.0;
                    robot.1 += movement.1;
                }
            }
            ']' => {
                if let Some(positions) =
                    block_search((robot.0 + movement.0, robot.1 + movement.1), movement, &map)
                {
                    let mut visited = std::collections::HashSet::<(i32, i32)>::new();
                    positions.into_iter().for_each(|pos| {
                        if visited.contains(&pos) {
                            return;
                        }
                        visited.insert(pos);
                        map[(pos.1 + movement.1) as usize][(pos.0 + movement.0) as usize] =
                            map[pos.1 as usize][pos.0 as usize];
                        map[pos.1 as usize][pos.0 as usize] = '.';
                    });
                    robot.0 += movement.0;
                    robot.1 += movement.1;
                }
            }
            _ => (),
        }
    }
    map.iter()
        .enumerate()
        .flat_map(|(y, row)| {
            row.iter()
                .enumerate()
                .filter(|(_, ch)| ch == &&'[')
                .map(move |(x, _)| y * 100 + x)
        })
        .sum()
}

/// This is the recursive forward search for part 2
/// We return None if we hit a wall, and otherwise accumulate all the blocks on that branch
/// If a recursive call returns None, then so does this, propogating the None
fn block_search(
    position: (i32, i32),
    movement: (i32, i32),
    map: &Vec<Vec<char>>,
) -> Option<Vec<(i32, i32)>> {
    match map[position.1 as usize][position.0 as usize] {
        '[' => {
            if movement.1 == 0 {
                block_search(
                    (position.0 + movement.0, position.1 + movement.1),
                    movement,
                    map,
                )
                .map(|aside| aside.into_iter().chain(vec![position]).collect())
            } else if let Some(next) =
                block_search((position.0, position.1 + movement.1), movement, map)
            {
                block_search((position.0 + 1, position.1 + movement.1), movement, map).map(
                    |beyond| {
                        next.into_iter()
                            .chain(beyond)
                            .chain(vec![position, (position.0 + 1, position.1)])
                            .collect()
                    },
                )
            } else {
                None
            }
        }
        ']' => {
            if movement.1 == 0 {
                block_search(
                    (position.0 + movement.0, position.1 + movement.1),
                    movement,
                    map,
                )
                .map(|aside| aside.into_iter().chain(vec![position]).collect())
            } else if let Some(next) =
                block_search((position.0, position.1 + movement.1), movement, map)
            {
                block_search((position.0 - 1, position.1 + movement.1), movement, map).map(
                    |beyond| {
                        next.into_iter()
                            .chain(beyond)
                            .chain(vec![position, (position.0 - 1, position.1)])
                            .collect()
                    },
                )
            } else {
                None
            }
        }
        '#' => None,
        '.' => Some(vec![]),
        _ => None,
    }
}

#[cfg(test)]
mod tests {
    extern crate test;
    use super::*;
    use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-15.txt").trim();
        b.iter(move || part_one(input));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-15.txt").trim();
        b.iter(move || part_two(input));
    }
}

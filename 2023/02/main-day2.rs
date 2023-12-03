//! ```cargo
//! [dependencies]
//! regex = "1.10.2"
//! ```

/**
 * --- Day 2: Cube Conundrum ---
 * Part 1: 00:47:16  9912
 * Part 2: 00:50:33  8786
 * Here, we are figuring out potention numbers of cubes in a bag
 * Based on specific handfuls of cubes shown from the bag
 */
const INPUT: &str = include_str!("../../utils/.cache/2023-2.txt");
use regex::Regex;
use std::cmp::max;

/**
 * Each game has a number of cubes of each color, or at least, a minimum number of cubes of each color.
 */
#[derive(Debug)]
struct GameData {
    id: i32,
    red: i32,
    green: i32,
    blue: i32,
}

/**
 * For Part 2 we turn each games minimum cube count into a power level by multiplying them together
 */
impl GameData {
    fn to_power(self) -> i32 {
        self.red * self.green * self.blue
    }
}

/**
 * This is our handling of the text input into our cube numbers
 * We just find the maximum number of cubes of each color
 * shown from among all the draws
 * Example:
 * Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
 * GameData {
 *   id: 1,
 *   red: 4,
 *   green: 2,
 *   blue: 6,
 * }
 */
impl From<&str> for GameData {
    fn from(line: &str) -> Self {
        let id_regexp = Regex::new(r"Game (\d+):").unwrap();
        let cube_regexp = Regex::new(r"(\d+) (red|blue|green)").unwrap();
        let game_id = id_regexp
            .captures(line)
            .unwrap()
            .get(1)
            .unwrap()
            .as_str()
            .parse::<i32>()
            .unwrap();
        cube_regexp.captures_iter(line).fold(
            GameData {
                id: game_id,
                red: 0,
                green: 0,
                blue: 0,
            },
            |acc, cap| {
                let cube_count = cap.get(1).unwrap().as_str().parse::<i32>().unwrap();
                let cube_color = cap.get(2).unwrap().as_str();
                match cube_color {
                    "red" => GameData {
                        red: max(acc.red, cube_count),
                        ..acc
                    },
                    "green" => GameData {
                        green: max(acc.green, cube_count),
                        ..acc
                    },
                    "blue" => GameData {
                        blue: max(acc.blue, cube_count),
                        ..acc
                    },
                    _ => acc,
                }
            },
        )
    }
}

/**
 * Part One requires comparing numbers of cubes against a limit
 */
impl PartialEq for GameData {
    fn eq(&self, other: &Self) -> bool {
        self.red == other.red && self.green == other.green && self.blue == other.blue
    }
}
impl PartialOrd for GameData {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        if self.red > other.red || self.green > other.green || self.blue > other.blue {
            return Some(std::cmp::Ordering::Greater);
        }
        if self.red < other.red || self.green < other.green || self.blue < other.blue {
            return Some(std::cmp::Ordering::Less);
        }
        Some(self.eq(other).cmp(&true))
    }
}

/**
 * Part One:
 * We are given a list of games, and need to find which games could not
 * possibly have had only this number of cubes
 * Simple map over the input, create the games, compare against our limits, and sum the ids
 */
const GAME_LIMITS: GameData = GameData {
    id: 0,
    red: 12,
    green: 13,
    blue: 14,
};
fn part_one(input: &str) -> i32 {
    input
        .lines()
        .map(GameData::from)
        .filter(|game| game <= &GAME_LIMITS)
        .map(|game| game.id)
        .sum()
}

/**
 * Part Two:
 * We are given a list of games, and need to find the total power level of all the games
 * Simply map over the input, create the games, find the power level, and sum the power levels
 * Overall, Part Two was very simple to go from how I implemented Part One.
 * No gotchas or catches with a naive approach.
 */
fn part_two(input: &str) -> i32 {
    input
        .lines()
        .map(GameData::from)
        .map(GameData::to_power)
        .sum()
}

pub fn main() {
    part_one_test(PART_ONE_EXAMPLE);
    part_two_test(PART_ONE_EXAMPLE);
    println!("Part one: {}", part_one(INPUT));
    println!("Part two: {}", part_two(INPUT));
}

const PART_ONE_EXAMPLE: &str = "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green";

fn part_one_test(contents: &str) {
    let outcome = part_one(contents);
    assert!(outcome == 8);
}
fn part_two_test(contents: &str) {
    let outcome = part_two(contents);
    assert!(outcome == 2286);
}

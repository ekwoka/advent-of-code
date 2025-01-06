#!/usr/bin/env rust-script
//! ```cargo
//! [dependencies]
//! regex = "1.10.2"
//! ```
/**
 * --- Day 5:  ---
 * Part 1:
 * Part 2:
 */
use regex::Regex;
use std::cmp::{max, min};

const INPUT: &str = include_str!("../../node_modules/.aoc-cache/2023-5.txt");

fn part_one(input: &str) -> u32 {
    let number_regex = Regex::new(r"\d+").unwrap();
    let mut lines = input.lines();
    let mut seeds = number_regex
        .captures_iter(lines.next().expect("Input is provided in standard format"))
        .map(|cap| cap[0].parse::<u32>().unwrap())
        .map(|id| Seed {
            id,
            soil: None,
            fertilizer: None,
            water: None,
            light: None,
            temperature: None,
            humidity: None,
            location: None,
        })
        .collect::<Vec<Seed>>();
    lines
        .filter(|line| line != &"")
        .scan("", |map, line| {
            if line.contains("map") {
                *map = line;
            }
            Some((*map, line))
        })
        .filter(|(map, line)| *map != *line && !line.is_empty())
        .map(|(map, line)| {
            let mut values = number_regex
                .captures_iter(line)
                .map(|cap| cap[0].parse::<u32>().unwrap());
            let target = values.next().unwrap();
            let start = values.next().unwrap();
            let range = values.next().unwrap();
            (map, start, range, target)
        })
        .for_each(|(map, start, range, target)| {
            seeds
                .iter_mut()
                .filter(|seed| seed.get_out_value(map).is_none())
                .for_each(|seed| {
                    seed.update_value_from_map(map, start, range, target);
                });
        });
    seeds
        .iter()
        .map(|seed| seed.location.or(seed.humidity).unwrap())
        .min()
        .unwrap()
}

fn part_two(input: &str) -> u32 {
    let number_regex = Regex::new(r"\d+").unwrap();
    let mut lines = input.lines();
    let seeds = Regex::new(r"(\d+) (\d+)")
        .unwrap()
        .captures_iter(lines.next().expect("Input is provided in standard format"))
        .map(|cap| {
            let start = cap[1].parse::<u32>().unwrap();
            let range = cap[2].parse::<u32>().unwrap();
            MapRange(start, range)
        })
        .fold(
            SeedBag {
                seeds: Vec::new(),
                soil: Vec::new(),
                fertilizer: Vec::new(),
                water: Vec::new(),
                light: Vec::new(),
                temperature: Vec::new(),
                humidity: Vec::new(),
                location: Vec::new(),
            },
            |mut acc, map| {
                acc.seeds.push(map);
                acc
            },
        );
    lines
        .filter(|line| line != &"")
        .scan("", |map, line| {
            if line.contains("map") {
                *map = line;
            }
            Some((*map, line))
        })
        .filter(|(map, line)| *map != *line && !line.is_empty())
        .map(|(map, line)| {
            let mut values = number_regex
                .captures_iter(line)
                .map(|cap| cap[0].parse::<u32>().unwrap());
            let target = values.next().unwrap();
            let start = values.next().unwrap();
            let range = values.next().unwrap();
            (map, MapRange(start, range), target)
        })
        .fold(seeds, |mut seeds, (map, range, target)| {
            seeds.carry_over(map);
            seeds.update_values(map, range, target);
            seeds
        })
        .finalize()
        .iter()
        .map(|range| range.start())
        .min()
        .unwrap()
}

#[derive(Debug)]
struct Seed {
    id: u32,
    soil: Option<u32>,
    fertilizer: Option<u32>,
    water: Option<u32>,
    light: Option<u32>,
    temperature: Option<u32>,
    humidity: Option<u32>,
    location: Option<u32>,
}
impl Seed {
    fn update_value_from_map(&mut self, map: &str, start: u32, range: u32, target: u32) {
        if self.get_in_value(map).is_none() {
            let prev = get_previous_map(map);
            self.update_value(
                prev,
                self.get_in_value(prev)
                    .expect("We shouldn't be here if we haven't processed this"),
            );
        }
        if let Some(value) = should_update(
            self.get_in_value(map)
                .expect("We shouldn't be here if we haven't processed this"),
            start,
            range,
            target,
        ) { self.update_value(map, value) }
    }
    fn get_out_value(&self, map: &str) -> Option<u32> {
        match map {
            "seed-to-soil map:" => self.soil,
            "soil-to-fertilizer map:" => self.fertilizer,
            "fertilizer-to-water map:" => self.water,
            "water-to-light map:" => self.light,
            "light-to-temperature map:" => self.temperature,
            "temperature-to-humidity map:" => self.humidity,
            "humidity-to-location map:" => self.location,
            _ => None,
        }
    }
    fn get_in_value(&self, map: &str) -> Option<u32> {
        match map {
            "seed-to-soil map:" => Some(self.id),
            "soil-to-fertilizer map:" => self.soil,
            "fertilizer-to-water map:" => self.fertilizer,
            "water-to-light map:" => self.water,
            "light-to-temperature map:" => self.light,
            "temperature-to-humidity map:" => self.temperature,
            "humidity-to-location map:" => self.humidity,
            _ => None,
        }
    }
    fn update_value(&mut self, map: &str, value: u32) {
        match map {
            "seed-to-soil map:" => self.soil = Some(value),
            "soil-to-fertilizer map:" => self.fertilizer = Some(value),
            "fertilizer-to-water map:" => self.water = Some(value),
            "water-to-light map:" => self.light = Some(value),
            "light-to-temperature map:" => self.temperature = Some(value),
            "temperature-to-humidity map:" => self.humidity = Some(value),
            "humidity-to-location map:" => self.location = Some(value),
            _ => (),
        }
    }
}

#[derive(Debug)]
struct SeedBag {
    seeds: Vec<MapRange>,
    soil: Vec<MapRange>,
    fertilizer: Vec<MapRange>,
    water: Vec<MapRange>,
    light: Vec<MapRange>,
    temperature: Vec<MapRange>,
    humidity: Vec<MapRange>,
    location: Vec<MapRange>,
}
impl SeedBag {
    fn update_values(&mut self, map: &str, range: MapRange, target: u32) {
        let ranges = self.get_field_from_map(map, false);
        let (remaining, overlapped) = ranges
            .iter()
            .filter(|range| !range.empty())
            .map(|seed| {
                let overlap = *seed & range;
                let adjusted_overlap = if range.start() < target {
                    overlap >> (target - range.start())
                } else {
                    overlap << (range.start() - target)
                };
                let remaining = *seed - range;
                (remaining, adjusted_overlap)
            })
            .fold(
                (Vec::new(), Vec::new()),
                |(mut remaining, mut overlapped), (rem, over)| {
                    if !rem.0.empty() {
                        remaining.push(rem.0);
                    }
                    if !rem.1.empty() {
                        remaining.push(rem.1);
                    }
                    if !over.empty() {
                        overlapped.push(over);
                    }
                    (remaining.unique(), overlapped.unique())
                },
            );
        match map {
            "seed-to-soil map:" => {
                self.seeds = remaining;
                overlapped.iter().for_each(|range| {
                    self.soil.push(*range);
                })
            }
            "soil-to-fertilizer map:" => {
                self.soil = remaining;
                overlapped.iter().for_each(|range| {
                    self.fertilizer.push(*range);
                })
            }
            "fertilizer-to-water map:" => {
                self.fertilizer = remaining;
                overlapped.iter().for_each(|range| {
                    self.water.push(*range);
                })
            }
            "water-to-light map:" => {
                self.water = remaining;
                overlapped.iter().for_each(|range| {
                    self.light.push(*range);
                })
            }
            "light-to-temperature map:" => {
                self.light = remaining;
                overlapped.iter().for_each(|range| {
                    self.temperature.push(*range);
                })
            }
            "temperature-to-humidity map:" => {
                self.temperature = remaining;
                overlapped.iter().for_each(|range| {
                    self.humidity.push(*range);
                })
            }
            "humidity-to-location map:" => {
                self.humidity = remaining;
                overlapped.iter().for_each(|range| {
                    self.location.push(*range);
                })
            }
            _ => (),
        };
    }
    fn get_field_from_map(&self, map: &str, end: bool) -> &Vec<MapRange> {
        match (map, end) {
            ("seed-to-soil map:", false) => &self.seeds,
            ("seed-to-soil map:", true) => &self.soil,
            ("soil-to-fertilizer map:", false) => &self.soil,
            ("soil-to-fertilizer map:", true) => &self.fertilizer,
            ("fertilizer-to-water map:", false) => &self.fertilizer,
            ("fertilizer-to-water map:", true) => &self.water,
            ("water-to-light map:", false) => &self.water,
            ("water-to-light map:", true) => &self.light,
            ("light-to-temperature map:", false) => &self.light,
            ("light-to-temperature map:", true) => &self.temperature,
            ("temperature-to-humidity map:", false) => &self.temperature,
            ("temperature-to-humidity map:", true) => &self.humidity,
            ("humidity-to-location map:", false) => &self.humidity,
            ("humidity-to-location map:", true) => &self.location,
            (&_, _) => todo!(),
        }
    }
    fn carry_over(&mut self, map: &str) {
        match map {
            "soil-to-fertilizer map:" => {
                self.seeds.iter().for_each(|range| {
                    self.soil.push(*range);
                });
                self.seeds = Vec::new();
            }
            "fertilizer-to-water map:" => {
                self.soil.iter().for_each(|range| {
                    self.fertilizer.push(*range);
                });
                self.soil = Vec::new();
            }
            "water-to-light map:" => {
                self.fertilizer.iter().for_each(|range| {
                    self.water.push(*range);
                });
                self.fertilizer = Vec::new();
            }
            "light-to-temperature map:" => {
                self.water.iter().for_each(|range| {
                    self.light.push(*range);
                });
                self.water = Vec::new();
            }
            "temperature-to-humidity map:" => {
                self.light.iter().for_each(|range| {
                    self.temperature.push(*range);
                });
                self.light = Vec::new();
            }
            "humidity-to-location map:" => {
                self.temperature.iter().for_each(|range| {
                    self.humidity.push(*range);
                });
                self.temperature = Vec::new();
            }
            _ => (),
        };
    }
    fn finalize(mut self) -> Vec<MapRange> {
        self.humidity.iter().for_each(|range| {
            self.location.push(*range);
        });
        self.location
    }
}

trait Unique {
    fn unique(&self) -> Self;
}
impl Unique for Vec<MapRange> {
    fn unique(&self) -> Self {
        let mut unique = Vec::new();
        self.iter().for_each(|range| {
            if !unique.contains(range) {
                unique.push(*range);
            }
        });
        unique
    }
}

#[derive(Debug, Copy, Clone, std::cmp::PartialEq)]
struct MapRange(u32, u32);
impl MapRange {
    fn start(&self) -> u32 {
        self.0
    }
    fn end(&self) -> u32 {
        self.0 + self.1
    }
    fn range(&self) -> u32 {
        self.1
    }
    fn empty(&self) -> bool {
        self.1 == 0
    }
}

impl std::ops::BitAnd for MapRange {
    type Output = Self;
    fn bitand(self, rhs: Self) -> Self::Output {
        let start = max(self.start(), rhs.start());
        let end = min(self.end(), rhs.end());
        MapRange(start, end.saturating_sub(start))
    }
}

impl std::ops::Shl<u32> for MapRange {
    type Output = Self;
    fn shl(self, rhs: u32) -> Self::Output {
        MapRange(self.start() - rhs, self.range())
    }
}
impl std::ops::Shr<u32> for MapRange {
    type Output = Self;
    fn shr(self, rhs: u32) -> Self::Output {
        MapRange(self.start() + rhs, self.range())
    }
}

impl std::ops::Sub for MapRange {
    type Output = (Self, Self);
    fn sub(self, rhs: Self) -> Self::Output {
        let low_start = self.start();
        let low_end = min(self.end(), max(self.start(), rhs.start()));
        let high_end = self.end();
        let high_start = max(self.start(), min(self.end(), rhs.end()));
        (
            MapRange(low_start, low_end.saturating_sub(low_start)),
            MapRange(high_start, high_end.saturating_sub(high_start)),
        )
    }
}

fn get_previous_map(map: &str) -> &str {
    match map {
        "soil-to-fertilizer map:" => "seed-to-soil map:",
        "fertilizer-to-water map:" => "soil-to-fertilizer map:",
        "water-to-light map:" => "fertilizer-to-water map:",
        "light-to-temperature map:" => "water-to-light map:",
        "temperature-to-humidity map:" => "light-to-temperature map:",
        "humidity-to-location map:" => "temperature-to-humidity map:",
        _ => "seed-to-soil map:",
    }
}

fn should_update(value: u32, start: u32, range: u32, target: u32) -> Option<u32> {
    if value >= start && value < start + range {
        Some(target + (value - start))
    } else {
        None
    }
}

fn main() {
    part_one_test();
    part_two_test();
    println!("Part 1: {}", part_one(INPUT));
    println!("Part 2: {}", part_two(INPUT));
}

const EXAMPLE: &str = r"seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4";

fn part_one_test() {
    assert_eq!(part_one(EXAMPLE), 35);
}
fn part_two_test() {
    assert_eq!(part_two(EXAMPLE), 46);
}

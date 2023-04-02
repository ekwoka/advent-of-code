#!/usr/bin/env rust-script
use std::fs;
use std::collections::HashMap;

fn part_one(rounds: Vec<Vec<i32>>) {
    let scores = rounds
        .iter()
        .map(|round| {
            let result: i32 = (round[0] - round[1] + 3) % 3;
            if result == 0 {
                return 3 + round[1];
            }
            if result == 1 {
                return 0 + round[1];
            }
            6 + round[1]
        })
        .reduce(|a, b| a + b)
        .unwrap();
    println!("Part one: {}", scores);
}

fn part_two(rounds: Vec<Vec<i32>>) {
    let scores = rounds
        .iter()
        .map(|round| {
            let result_score: i32 = (round[1] - 1) * 3;
            let sign_score = ((round[0] + 2 + (round[1] - 2)) % 3) + 1;
            result_score + sign_score
        })
        .reduce(|a, b| a + b)
        .unwrap();
    println!("Part two: {}", scores);
}

fn main() {
    let contents = fs::read_to_string("input.txt").expect("Something went wrong reading the file");
    let type_map = HashMap::from([
        ('A', 1),
        ('B', 2),
        ('C', 3),
        ('X', 1),
        ('Y', 2),
        ('Z', 3),
    ]);
    let rounds: Vec<Vec<i32>> = contents
        .lines()
        .map(|line|
            line
                .trim()
                .split(' ')
                .map(|item| type_map[&item.chars().next().unwrap()])
                .collect::<Vec<i32>>()
        )
        .collect();
    part_one(rounds.clone());
    part_two(rounds);
}
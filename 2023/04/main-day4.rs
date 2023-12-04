/**
 * --- Day 4:  ---
 * Part 1:
 * Part 2:
 */
use regex::Regex;
use std::collections::VecDeque;
use std::os::raw::c_char;

#[no_mangle]
pub extern "C" fn part_one(cstring: *const c_char) -> i32 {
    let input: &str = unsafe { std::ffi::CStr::from_ptr(cstring).to_str().unwrap() };
    input
        .lines()
        .map(|line| {
            line.split(": ")
                .last()
                .unwrap()
                .split(" | ")
                .collect::<Vec<&str>>()
        })
        .filter_map(|card| {
            let number_regex = Regex::new(r"\d+").unwrap();
            let numbers = number_regex
                .captures_iter(card[1]).map(|cap| cap[0].to_string()).collect::<Vec<String>>();
            match number_regex
                .captures_iter(card[0])
                .filter(|cap| numbers.contains(&cap[0].to_string()))
                .count() {
                    0 => None,
                    x => Some(2i32.pow(x.saturating_sub(1).try_into().unwrap()))
                }
        })
        .sum()
}

#[no_mangle]
pub extern "C" fn part_two(cstring: *const c_char) -> i32 {
    let input: &str = unsafe { std::ffi::CStr::from_ptr(cstring).to_str().unwrap() };
    input
        .lines()
        .map(|line| {
            line.split(": ")
                .last()
                .unwrap()
                .split(" | ")
                .collect::<Vec<&str>>()
        })
        .map(|card| {
            let number_regex = Regex::new(r"\d+").unwrap();
            let numbers = number_regex
                .captures_iter(card[1]).map(|cap| cap[0].to_string()).collect::<Vec<String>>();
            number_regex
                .captures_iter(card[0])
                .filter(|cap| numbers.contains(&cap[0].to_string()))
                .count()
        })
        .scan(VecDeque::from([0;13]), |mods, wins| {
            let current_mod = mods.pop_front().unwrap() + 1;
            mods.push_back(0);
            (0..wins).for_each(|idx| {
                mods[idx] += current_mod;
            });
            Some(current_mod)
            }).sum()
}

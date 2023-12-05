/**
 * --- Day 5:  ---
 * Part 1:
 * Part 2:
 */
use regex::Regex;
use std::collections::VecDeque;
use std::os::raw::c_char;

#[no_mangle]
pub extern "C" fn part_one(cstring: *const c_char) -> i32 {
    let input: &str = unsafe { std::ffi::CStr::from_ptr(cstring).to_str().unwrap() };
    input.len() as i32
}

#[no_mangle]
pub extern "C" fn part_two(cstring: *const c_char) -> i32 {
    let input: &str = unsafe { std::ffi::CStr::from_ptr(cstring).to_str().unwrap() };
    input.len() as i32
}

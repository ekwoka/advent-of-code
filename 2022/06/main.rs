use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}

/* Faster than the super optimized one from the video */
#[wasm_bindgen]
pub fn get_message_optimized_bits(input: String, length: usize) -> usize {
  let bytes = input.as_bytes();
  let mut l = 0;
  let mut r = 0;
  let mut seen = 0;
  let mut count = 0;
  while count != length && r < bytes.len() {
    let byte = bytes[r];
    let bit = 1 << (byte -97);
    if seen & bit != 0 {
      while bytes[l] != byte {
        let bit = 1 << (bytes[l] - 97);
        seen &= !bit;
        l += 1;
        count -= 1;
      }
      l += 1;
    } else {
      seen |= bit;
      count += 1;
    }
    r += 1;
  }
  r
}

/* From Primeagen video: https://www.youtube.com/watch?v=U16RnpV48KQ&t=0s */
#[wasm_bindgen]
pub fn david(input: String, length: usize) -> usize {
  let mut idx = 0;
  let bytes = input.as_bytes();
  while let Some(slice) = bytes.get(idx..idx + length) {
    let mut state = 0u32;

    if let Some(pos) = slice.iter().rposition(|byte| {
      let bit_idx = byte % 32;
      let ret = state & (1 << bit_idx) != 0;
      state |= 1 << bit_idx;
      ret
    }) {
      idx += pos + 1;
    } else {
      return idx + length;
    }
  }
  0
}

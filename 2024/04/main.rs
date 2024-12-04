//! ```cargo
//! [dependencies]
//! ```

use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}


#[derive(Eq, PartialEq, Clone,Copy,Debug)]
struct Vec2(i32,i32);

impl std::ops::Add for Vec2 {
  type Output = Self;
  fn add(self, rhs: Self) -> Self {
    Vec2(self.0 + rhs.0, self.1 + rhs.1)
  }
}

impl std::hash::Hash for Vec2 {
  fn hash<H>(&self, hasher: &mut H) where H: std::hash::Hasher, {
    format!("{},{}",self.0, self.1).hash(hasher)
  }
}

#[wasm_bindgen]
pub fn part_one(input: String) -> usize {
  let mut letter_grid: std::collections::HashMap<Vec2,char> = std::collections::HashMap::new();
  input.lines()
    .enumerate()
    .flat_map(|(x,line)| line.chars()
      .enumerate()
      .map(move |(y,ch)| (Vec2(x as i32,y as i32), ch)))
    .for_each(|(vec,ch)| {
      letter_grid.insert(vec,ch);
    });
  letter_grid.iter()
    .filter(|(_,ch)| **ch == 'X' || **ch == 'S')
    .flat_map(|(start, _)|
      [Vec2(1,0), Vec2(0,1), Vec2(1,1), Vec2(1,-1)].into_iter()
        .map(|step| [start.clone()].into_iter()
          .chain((0..3).scan(start.clone(), |pos,_| {
            *pos = *pos + step;
            Some(*pos)
          }))
          .filter_map(|vec| letter_grid.get(&vec)).collect::<String>()
        )
    )
    .filter(|text| text == "XMAS" || text == "SAMX")
    .count()
}

#[wasm_bindgen]
pub fn part_two(input: String) -> usize {
    let mut letter_grid: std::collections::HashMap<Vec2,char> = std::collections::HashMap::new();
  input.lines()
    .enumerate()
    .flat_map(|(x,line)| line.chars()
      .enumerate()
      .map(move |(y,ch)| (Vec2(x as i32,y as i32), ch)))
    .for_each(|(vec,ch)| {
      letter_grid.insert(vec,ch);
    });
  letter_grid.iter()
    .filter(|(_,ch)| **ch == 'A')
    .filter(|(start, _)| {
      let first = [Vec2(-1,-1),Vec2(0,0), Vec2(1,1)].into_iter().map(|step| **start + step).filter_map(|vec| letter_grid.get(&vec)).collect::<String>();
      if first != "MAS" && first != "SAM" {
        false
      } else {
        let second = [Vec2(-1,1),Vec2(0,0), Vec2(1,-1)].into_iter().map(|step| **start + step).filter_map(|vec| letter_grid.get(&vec)).collect::<String>();
        second == "MAS" || second == "SAM"
      }
    })
    .count()
}
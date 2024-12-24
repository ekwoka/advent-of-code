#[derive(Eq, PartialEq, Clone, Copy, Debug)]
pub struct Vec2(pub usize, pub usize);

impl Vec2 {
  pub fn distance(&self, rhs: Self) -> usize {
    self.0.abs_diff(rhs.0) + self.1.abs_diff(rhs.1)
  }
  pub fn X() -> Self {
    Vec2(1,0)
  }
  pub fn Y() -> Self {
    Vec2(0,1)
  }
}

impl std::ops::Add for Vec2 {
  type Output = Self;
  fn add(self, rhs: Self) -> Self {
    Vec2(self.0 + rhs.0, self.1 + rhs.1)
  }
}

impl std::ops::Sub for Vec2 {
  type Output = Self;
  fn sub(self, rhs: Self) -> Self {
    Vec2(self.0.saturating_sub(rhs.0), self.1.saturating_sub(rhs.1))
  }
}

impl std::hash::Hash for Vec2 {
  fn hash<H>(&self, hasher: &mut H) where H: std::hash::Hasher, {
    format!("{},{}",self.0, self.1).hash(hasher)
  }
}

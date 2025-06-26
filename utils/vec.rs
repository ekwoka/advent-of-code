use std::ops::*;

#[derive(Eq, PartialEq, Clone, Copy, Debug)]
pub struct Vec2 {
    pub x: i32,
    pub y: i32,
}

#[allow(dead_code)]
impl Vec2 {
    /// All zeroes.
    pub const ZERO: Self = Self::splat(0);

    /// All ones.
    pub const ONE: Self = Self::splat(1);

    /// All negative ones.
    pub const NEG_ONE: Self = Self::splat(-1);

    /// All `i32::MIN`.
    pub const MIN: Self = Self::splat(i32::MIN);

    /// All `i32::MAX`.
    pub const MAX: Self = Self::splat(i32::MAX);

    /// A unit vector pointing along the positive X axis.
    pub const X: Self = Self::new(1, 0);

    /// A unit vector pointing along the positive Y axis.
    pub const Y: Self = Self::new(0, 1);

    /// A unit vector pointing along the negative X axis.
    pub const NEG_X: Self = Self::new(-1, 0);

    /// A unit vector pointing along the negative Y axis.
    pub const NEG_Y: Self = Self::new(0, -1);

    /// The unit axes.
    pub const AXES: [Self; 2] = [Self::X, Self::Y];

    pub const NEIGHBORS: [Self; 8] = {
        [
            Self::Y,
            Self::ONE,
            Self::X,
            Self::new(1, -1),
            Self::NEG_Y,
            Self::NEG_ONE,
            Self::NEG_X,
            Self::new(-1, 1),
        ]
    };

    pub const NEIGHBORS_CARDINAL: [Self; 4] = { [Self::Y, Self::X, Self::NEG_Y, Self::NEG_X] };

    #[inline(always)]
    #[must_use]
    pub const fn new(x: i32, y: i32) -> Self {
        Self { x, y }
    }

    /// Creates a vector with all elements set to `v`.
    #[inline]
    #[must_use]
    pub const fn splat(v: i32) -> Self {
        Self { x: v, y: v }
    }

    pub fn manhatten_distance(&self, rhs: Self) -> u32 {
        self.x.abs_diff(rhs.x) + self.y.abs_diff(rhs.y)
    }

    pub fn rotate_left(&self) -> Self {
        Self {
            x: -self.y,
            y: self.x,
        }
    }
    pub fn rotate_right(&self) -> Self {
        Self {
            x: self.y,
            y: -self.x,
        }
    }
}

impl std::fmt::Display for Vec2 {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}, {}", self.x, self.y)
    }
}

impl Default for Vec2 {
    #[inline(always)]
    fn default() -> Self {
        Self::ZERO
    }
}

impl Add<Vec2> for Vec2 {
    type Output = Self;
    fn add(self, rhs: Self) -> Self {
        Vec2::new(self.x + rhs.x, self.y + rhs.y)
    }
}

impl Sub<Vec2> for Vec2 {
    type Output = Self;
    fn sub(self, rhs: Self) -> Self {
        Vec2::new(self.x.saturating_sub(rhs.x), self.y.saturating_sub(rhs.y))
    }
}

impl Mul<Vec2> for Vec2 {
    type Output = Self;
    #[inline]
    fn mul(self, rhs: Self) -> Self {
        Self {
            x: self.x * rhs.x,
            y: self.y * rhs.y,
        }
    }
}

impl Mul<&Vec2> for Vec2 {
    type Output = Vec2;
    #[inline]
    fn mul(self, rhs: &Vec2) -> Vec2 {
        self.mul(*rhs)
    }
}

impl Mul<&Vec2> for &Vec2 {
    type Output = Vec2;
    #[inline]
    fn mul(self, rhs: &Vec2) -> Vec2 {
        (*self).mul(*rhs)
    }
}

impl Mul<Vec2> for &Vec2 {
    type Output = Vec2;
    #[inline]
    fn mul(self, rhs: Vec2) -> Vec2 {
        (*self).mul(rhs)
    }
}

impl Mul<i32> for Vec2 {
    type Output = Self;
    #[inline]
    fn mul(self, rhs: i32) -> Self {
        Self {
            x: self.x * rhs,
            y: self.y * rhs,
        }
    }
}

impl Mul<i32> for &Vec2 {
    type Output = Vec2;
    #[inline]
    fn mul(self, rhs: i32) -> Vec2 {
        (*self).mul(rhs)
    }
}

impl std::hash::Hash for Vec2 {
    fn hash<H>(&self, hasher: &mut H)
    where
        H: std::hash::Hasher,
    {
        format!("{},{}", self.x, self.y).hash(hasher)
    }
}

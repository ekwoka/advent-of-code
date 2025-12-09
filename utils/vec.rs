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

    pub fn length(&self) -> f32 {
        (self.x.pow(2) + self.y.pow(2)) as f32
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

    pub fn max(&self, rhs: Self) -> Self {
        Self {
            x: self.x.max(rhs.x),
            y: self.y.max(rhs.y),
        }
    }

    pub fn min(&self, rhs: Self) -> Self {
        Self {
            x: self.x.min(rhs.x),
            y: self.y.min(rhs.y),
        }
    }

    pub fn abs(&self) -> Self {
        Self {
            x: self.x.abs(),
            y: self.y.abs(),
        }
    }

    pub fn area(&self) -> i32 {
        self.x * self.y
    }

    pub fn max_own(&self) -> i32 {
        self.x.max(self.y)
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

#[derive(Eq, PartialEq, Clone, Copy, Debug)]
pub struct Vec3 {
    pub x: i32,
    pub y: i32,
    pub z: i32,
}

#[allow(dead_code)]
impl Vec3 {
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
    pub const X: Self = Self::new(1, 0, 0);

    /// A unit vector pointing along the positive Y axis.
    pub const Y: Self = Self::new(0, 1, 0);

    /// A unit vector pointing along the positive Z axis.
    pub const Z: Self = Self::new(0, 0, 1);

    /// A unit vector pointing along the negative X axis.
    pub const NEG_X: Self = Self::new(-1, 0, 0);

    /// A unit vector pointing along the negative Y axis.
    pub const NEG_Y: Self = Self::new(0, -1, 0);

    /// A unit vector pointing along the negative Z axis.
    pub const NEG_Z: Self = Self::new(0, 0, -1);

    /// The unit axes.
    pub const AXES: [Self; 3] = [Self::X, Self::Y, Self::Z];

    #[inline(always)]
    #[must_use]
    pub const fn new(x: i32, y: i32, z: i32) -> Self {
        Self { x, y, z }
    }

    /// Creates a vector with all elements set to `v`.
    #[inline]
    #[must_use]
    pub const fn splat(v: i32) -> Self {
        Self { x: v, y: v, z: v }
    }

    pub fn manhatten_distance(&self, rhs: Self) -> u32 {
        self.x.abs_diff(rhs.x) + self.y.abs_diff(rhs.y) + self.z.abs_diff(rhs.z)
    }

    pub fn length(&self) -> f64 {
        (((self.x as i64).pow(2) + (self.y as i64).pow(2) + (self.z as i64).pow(2)) as f64).sqrt()
    }

    pub fn length_squared(&self) -> i64 {
        (self.x as i64).pow(2) + (self.y as i64).pow(2) + (self.z as i64).pow(2)
    }

    pub fn distance(&self, rhs: &Self) -> f64 {
        (*self - *rhs).length()
    }

    pub fn distance_squared(&self, rhs: &Self) -> i64 {
        (*self - *rhs).length_squared()
    }
}

impl std::fmt::Display for Vec3 {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}, {}, {}", self.x, self.y, self.z)
    }
}

impl Default for Vec3 {
    #[inline(always)]
    fn default() -> Self {
        Self::ZERO
    }
}

impl Add<Vec3> for Vec3 {
    type Output = Self;
    fn add(self, rhs: Self) -> Self {
        Vec3::new(self.x + rhs.x, self.y + rhs.y, self.z + rhs.z)
    }
}

impl Sub<Vec3> for Vec3 {
    type Output = Self;
    fn sub(self, rhs: Self) -> Self {
        Vec3::new(
            self.x.saturating_sub(rhs.x),
            self.y.saturating_sub(rhs.y),
            self.z.saturating_sub(rhs.z),
        )
    }
}

impl Mul<Vec3> for Vec3 {
    type Output = Self;
    #[inline]
    fn mul(self, rhs: Self) -> Self {
        Self {
            x: self.x * rhs.x,
            y: self.y * rhs.y,
            z: self.z * rhs.z,
        }
    }
}

impl Mul<&Vec3> for Vec3 {
    type Output = Vec3;
    #[inline]
    fn mul(self, rhs: &Vec3) -> Vec3 {
        self.mul(*rhs)
    }
}

impl Mul<&Vec3> for &Vec3 {
    type Output = Vec3;
    #[inline]
    fn mul(self, rhs: &Vec3) -> Vec3 {
        (*self).mul(*rhs)
    }
}

impl Mul<Vec3> for &Vec3 {
    type Output = Vec3;
    #[inline]
    fn mul(self, rhs: Vec3) -> Vec3 {
        (*self).mul(rhs)
    }
}

impl Mul<i32> for Vec3 {
    type Output = Self;
    #[inline]
    fn mul(self, rhs: i32) -> Self {
        Self {
            x: self.x * rhs,
            y: self.y * rhs,
            z: self.z * rhs,
        }
    }
}

impl Mul<i32> for &Vec3 {
    type Output = Vec3;
    #[inline]
    fn mul(self, rhs: i32) -> Vec3 {
        (*self).mul(rhs)
    }
}

impl std::hash::Hash for Vec3 {
    fn hash<H>(&self, hasher: &mut H)
    where
        H: std::hash::Hasher,
    {
        format!("{},{},{}", self.x, self.y, self.z).hash(hasher)
    }
}

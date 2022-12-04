const TARGET = {
  x: {
    min: 144,
    max: 178,
  },
  y: {
    min: -100,
    max: -76,
  },
};

const ORIGIN = [0, 0];

const VALUES = Array(200)
  .fill()
  .map((_, i) => i);

function calcHeight(xV, yV) {
  let position = [...ORIGIN];
  let inTarget = false;
  let maxHeight = 0;

  while (
    !(position[0] >= TARGET.x.max || position[1] <= TARGET.y.min) &&
    !inTarget
  ) {
    position[0] += xV;
    position[1] += yV;
    xV = xV > 0 ? xV - 1 : 0;
    yV -= 1;

    maxHeight = Math.max(maxHeight, position[1]);

    if (
      position[0] >= TARGET.x.min &&
      position[1] <= TARGET.y.max &&
      position[0] <= TARGET.x.max &&
      position[1] >= TARGET.y.min
    ) {
      inTarget = true;
    }
  }

  return inTarget ? maxHeight : null;
}

function findMaxHeight() {
  let maxHeight = 0;
  let trajectory = [];
  let options = 0;

  for (let xV of VALUES) {
    for (let yV of VALUES) {
      yV -= Math.ceil(VALUES.at(-1) / 2);
      let height = calcHeight(xV, yV);
      if (height !== null) {
        options += 1;
        if (height > maxHeight) {
          maxHeight = height;
          trajectory = [xV, yV];
        }
      }
    }
  }

  return { maxHeight, trajectory, options };
}

console.log(findMaxHeight());

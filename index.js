"use strict";
// destructered matter-js library
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

// const cells = 10;
// provides easier attunment for sizing between square and rectangle mazes
const horizontalCells = 14;
const verticalCells = 10;
//   the canvas size is defined seperately to allow easy editing in the future
// window inner width and height will adjust accordingly to the available space on the window for dynmanic viewing
const width = window.innerWidth;
const height = window.innerHeight;
// will serve  to calcultate the unit width/length
// can use height or width as both have the same value(for squares atleast)
const unitLengthX = width / horizontalCells;
const unitLengthY = height / verticalCells;
// first step is to create a new engine
const engine = Engine.create();
// disables gravity in the y direction
engine.world.gravity.y = 0;
// when creating an engine a world object will be attached
// the {world} is a "snapshot" of all the different shapes that are possessed
const { world } = engine;

// will instruct render where everything will be revealed inside of the html document
const render = Render.create({
  // renders a representation of the world inside document.body
  element: document.body,
  engine: engine,
  //   will display the height and width of the canvas element
  options: {
    //   wireframes enables the shapes to take on solid colors, with the selection being at random. Must be set to false to include this
    // true will define the outlines of shapes
    wireframes: true,
    width: width,
    height: height,
  },
});
// will instruct the render object to begin working to display information on the screan
Render.run(render);
// runner cooridnates the process
Runner.run(Runner.create(), engine);

// // for shape, the first to numbers refer to where in the world the shape will be positioned at. are measured in the top left corner of the canvas to the shape.
// // the next two numbers control the lenght and hieght of the shape itself
// const shape = Bodies.rectangle(200, 200, 50, 50, {
//   // prevents the shape from moving(falling off the canvas)
//   isStatic: true,
// });
// World.add(world, shape);

// WALLS
const thickness = 2;
// for shape, the first to numbers refer to where in the world the shape will be positioned at. are measured in the top left corner of the canvas to the shape.
// the next two numbers control the lenght and hieght of the shape itself
const walls = [
  Bodies.rectangle(width / 2, 0, width, thickness, { isStatic: true }), //top
  Bodies.rectangle(width / 2, height, width, thickness, { isStatic: true }), // bottom
  Bodies.rectangle(0, height / 2, thickness, height, { isStatic: true }), // left
  Bodies.rectangle(width, height / 2, thickness, height, { isStatic: true }), // right
];

World.add(world, walls);

// MAZE GENERATOR
// // The for loop below is valid but is not concise do to many symbols being present
// const grid = [];

// for (let i = 0; i < 3; i++) {
//   grid.push([]);
//   for (let j = 0; j < 3; j++) {
//     grid[i].push(false);
//   }
// }
// console.log(grid);
// randomizes the start of the maze
const shuffle = (arr) => {
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter--;

    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }
  return arr;
};

const grid = Array(verticalCells)
  // does not matter what is inside the first fill as it is replaced by map. A direct fill will make all arrays mutable to a single edit
  .fill(null)
  // generates the dividers for the grid
  .map(() => Array(horizontalCells).fill(false));

const verticals = Array(verticalCells)
  .fill(null)
  .map(() => Array(verticalCells - 1).fill(false));

const horizontals = Array(horizontalCells - 1)
  .fill(null)
  .map(() => Array(horizontalCells).fill(false));
// console.log(grid);

const startRow = Math.floor(Math.random() * verticalCells);
const startColumn = Math.floor(Math.random() * horizontalCells);
// console.log(startRow, startColumn); //testing functionality
const cellTraversal = (row, column) => {
  // if I have visited the cell at [row,column], then return
  if (grid[row][column]) {
    return;
  }
  // Mark this cell as being visited

  grid[row][column] = true;
  // assmble randomly-ordered list of neighbors
  // use W,A,S,D for movement
  const neighbors = shuffle([
    [row - 1, column, "up"],
    [row, column + 1, "right"],
    [row + 1, column, "down"],
    [row, column - 1, "left"],
  ]);
  // console.log(neighbors); //testing functionality
  // for each neighbor....
  for (let neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor;
    // see if that neighbor is out of bounds
    if (
      nextRow < 0 ||
      nextRow >= verticalCells ||
      nextColumn < 0 ||
      nextColumn >= horizontalCells
    ) {
      // continue keyword stays on the loop and prevents the current iteration of the current step. a glorified skip function
      continue;
    }
    // if we have visited that neigbors, continue to next neighbor
    if (grid[nextRow][nextColumn]) {
      continue;
    }
    // remove a wall from either horizontal or verticals
    if (direction === "left") {
      verticals[row][column - 1] = true;
    } else if (direction === "right") {
      verticals[row][column] = true;
    } else if (direction === "up") {
      horizontals[row - 1][column] = true;
    } else if (direction === "down") {
      horizontals[row][column] = true;
    }
    cellTraversal(nextRow, nextColumn);
  }
  // Visit that next cell
};

cellTraversal(startRow, startColumn);
// console.log(grid);
// TO ESTABLISH PLACESMENTS OF WALLS
horizontals.forEach((row, rowIndex) => {
  // console.log(row); //testing purposes
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX / 2,
      rowIndex * unitLengthY + unitLengthY,
      unitLengthX,
      5,
      {
        label: "wall",
        isStatic: true,
      }
    );
    World.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX,
      rowIndex * unitLengthY + unitLengthY / 2,
      5,
      unitLengthY,
      {
        label: "wall",
        isStatic: true,
      }
    );
    World.add(world, wall);
  });
});

// GOAL LOCAITON SETTING
const goal = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  unitLengthX * 0.7,
  unitLengthY * 0.7,
  { label: "goal", isStatic: true }
);
World.add(world, goal);

// BALL SETTING
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
  label: "ball",
});
World.add(world, ball);

// click detection for ball
document.addEventListener("keydown", (event) => {
  const { x, y } = ball.velocity;
  // console.log(x, y);  //testing purposes
  // console.log(event); //testing purposes
  if (event.keyCode === 87) {
    // console.log("move ball up");  //testing purposes
    Body.setVelocity(ball, { x: x, y: y - 2 });
  }

  if (event.keyCode === 68) {
    // console.log("move ball right");  //testing purposes
    Body.setVelocity(ball, { x: x + 2, y: y });
  }

  if (event.keyCode === 83) {
    // console.log("move ball down");  //testing purposes
    Body.setVelocity(ball, { x: x, y: y + 2 });
  }

  if (event.keyCode === 65) {
    // console.log("move ball left");  //testing purposes
    Body.setVelocity(ball, { x: x - 2, y: y });
  }
});

// WIN CONDITION
Events.on(engine, "collisionStart", (event) => {
  // console.log(event); //testing purposes
  // will note all the different properties apart of the collision, as otherwise it would be wiped out
  event.pairs.forEach((collision) => {
    // console.log(collision); //testing purposes
    const labels = ["ball", "goal"];

    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      // console.log("user won"); //testing purposes
      world.gravity.y = 1;
      world.bodies.forEach((body) => {
        if (body.label === "wall") {
          Body.setStatic(body, false);
        }
      });
    }
  });
});

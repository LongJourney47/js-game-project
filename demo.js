// destructered matter-js library
const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } =
  Matter;

//   the canvas size is defined seperately to allow easy editing in the future
const width = 800;
const height = 600;

// first step is to create a new engine
const engine = Engine.create();
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
    wireframes: false,
    width: width,
    height: height,
  },
});
// will instruct the render object to begin working to display information on the screan
Render.run(render);
// runner cooridnates the process
Runner.run(Runner.create(), engine);

// enables the ability to click and drag objects in the field
World.add(
  world,
  MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas),
  })
);

// // for shape, the first to numbers refer to where in the world the shape will be positioned at. are measured in the top left corner of the canvas to the shape.
// // the next two numbers control the lenght and hieght of the shape itself
// const shape = Bodies.rectangle(200, 200, 50, 50, {
//   // prevents the shape from moving(falling off the canvas)
//   isStatic: true,
// });
// World.add(world, shape);

// WALLS
// for shape, the first to numbers refer to where in the world the shape will be positioned at. are measured in the top left corner of the canvas to the shape.
// the next two numbers control the lenght and hieght of the shape itself
const walls = [
  Bodies.rectangle(400, 0, 800, 40, { isStatic: true }), //top
  Bodies.rectangle(400, 600, 800, 40, { isStatic: true }), // bottom
  Bodies.rectangle(0, 300, 40, 600, { isStatic: true }), // left
  Bodies.rectangle(800, 300, 40, 600, { isStatic: true }), // right
];

World.add(world, walls);

// RANDOM SHAPES
// factory for shapes
for (let i = 0; i < 20; i++) {
  if (Math.random() > 0.5) {
    World.add(
      world,
      Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50)
    );
  } else {
    World.add(
      world,
      //third input controls the radius
      Bodies.circle(Math.random() * width, Math.random() * height, 35)
      //   // can manipualte the colors that the wireframes displays
      //   Bodies.circle(Math.random() * width, Math.random() * height, 35, {
      //     render: {
      //       fillStyle: "white",
      //     },
      //   })
    );
  }
}

const flock = [];

let alignSlider, cohesionSlider, separationSlider;
let alignLabel, choesionLabel, separationLabel;

let quadTree;

function setup() {
  createCanvas(windowWidth, windowHeight - 20);
  colorMode(HSB, 360, 100, 100, 100);
  quadTree = new QuadTree(Infinity, 30, new Rect(0, 0, width, height));
  alignSlider = createSlider(0, 2, 1, 0.1);
  alignSlider.position(0, windowHeight - 20);
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  cohesionSlider.position(200, windowHeight - 20);
  separationSlider = createSlider(0, 2, 1.25, 0.1);
  separationSlider.position(400, windowHeight - 20);

  for (let i = 0; i < 100; i++) {
    flock.push(new Boid());
  }
}

function draw() {
  quadTree.clear();
  for (const boid of flock) {
    quadTree.addItem(boid.position.x, boid.position.y, boid);
  }

  background(230, 30, 23);

  quadTree.debugRender();

  linearGradient(
    0,
    windowHeight - 5,
    windowWidth,
    windowHeight,
    color(120, 100, 100), //Start color
    color(220, 100, 100) //End color
  );

  textSize(24);
  text("Alignment", 2, windowHeight - 25);
  text("Cohesion", 200, windowHeight - 25);
  text("Seperation", 400, windowHeight - 25);
  stroke(0);

  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.render();
  }
}

function mousePressed() {
  flock.push(new Boid());
}

function linearGradient(sX, sY, eX, eY, colorS, colorE) {
  let gradient = drawingContext.createLinearGradient(sX, sY, eX, eY);
  gradient.addColorStop(0, colorS);
  gradient.addColorStop(1, colorE);
  drawingContext.fillStyle = gradient;
}

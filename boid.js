class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.03;
    this.maxSpeed = 2;
    this.r = 4;
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  align(boids) {
    let perceptionRadius = 50;
    let perceptionCount = 5;
    let steering = createVector();
    let total = 0;
    for (const other of quadTree.getItemsInRadius(
      this.position.x,
      this.position.y,
      perceptionRadius,
      perceptionCount
    )) {
      steering.add(other.velocity);
      total++;
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids) {
    let perceptionRadius = 50;
    let perceptionCount = 5;
    let steering = createVector();
    let total = 0;
    for (const other of quadTree.getItemsInRadius(
      this.position.x,
      this.position.y,
      perceptionRadius,
      perceptionCount
    )) {
      const diff = p5.Vector.sub(this.position, other.position);
      const d = diff.mag();
      if (d === 0) continue;
      diff.div(d * d);
      steering.add(diff);
      total++;
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(boids) {
    let perceptionRadius = 100;
    let perceptionCount = 5;
    let steering = createVector();
    let total = 0;
    for (const other of quadTree.getItemsInRadius(
      this.position.x,
      this.position.y,
      perceptionRadius,
      perceptionCount
    )) {
      steering.add(other.position);
      total++;
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    alignment.mult(alignSlider.value());
    cohesion.mult(cohesionSlider.value());
    separation.mult(separationSlider.value());

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }

  render() {
    push();

    linearGradient(
      0,
      -this.r * 2,
      this.r * 2,
      this.r * 2,
      color(120, 100, 100), //Start color
      color(220, 100, 100) //End color
    );
    strokeWeight(0);
    stroke(200);
    let theta = this.velocity.heading() + radians(90);
    translate(this.position.x, this.position.y);
    rotate(theta);
    triangle(0, -this.r * 2, -this.r, this.r * 2, this.r, this.r * 2);
    pop();
  }
}

class Rect {
  constructor(x = 0, y = 0, width = 1, height = 1) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  copy() {
    return new Rect(this.x, this.y, this.width, this.height);
  }
}

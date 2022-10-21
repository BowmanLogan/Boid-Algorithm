class QuadTreeItem {
  constructor(x, y, data) {
    this.x = x;
    this.y = y;
    this.data = data;
  }
}

class QuadTreeBin {
  constructor(maxDepth, maxItemsPerBin, extent, depth = 0) {
    this.rect = extent.copy();
    this.bins = null;
    this.maxDepth = maxDepth;
    this.maxItemsPerBin = maxItemsPerBin;
    this.items = [];
    this.depth = depth;
  }

  checkWithinExtent(x, y, range = 0) {
    return (
      x >= this.rect.x - range &&
      x < this.rect.x + this.rect.width + range &&
      y >= this.rect.y - range &&
      y < this.rect.y + this.rect.height + range
    );
  }

  addItem(item) {
    if (this.bins === null) {
      this.items.push(item);
      if (
        this.depth < this.maxDepth &&
        this.items !== null &&
        this.items.length > this.maxItemsPerBin
      )
        this.subDivide();
    } else {
      const binIndex = this._getBinIndex(item.x, item.y);
      if (binIndex != -1) this.bins[binIndex].addItem(item);
    }
  }

  getItemsInRadius(x, y, radius, maxItems) {
    const radiusSqrd = radius ** 2;
    let items = [];

    if (this.bins) {
      for (let b of this.bins)
        if (b.checkWithinExtent(x, y, radius))
          items.push(...b.getItemsInRadius(x, y, radius, maxItems));
    } else {
      for (let item of this.items) {
        const distSqrd = (item.x - x) ** 2 + (item.y - y) ** 2;
        if (distSqrd <= radiusSqrd)
          items.push({ distSqrd: distSqrd, data: item.data });
      }
    }

    return items;
  }

  subDivide() {
    if (this.bins !== null) return;
    this.bins = [];
    let w = this.rect.width * 0.5,
      h = this.rect.height * 0.5;
    for (let i = 0; i < 4; ++i)
      this.bins.push(
        new QuadTreeBin(
          this.maxDepth,
          this.maxItemsPerBin,
          new Rect(
            this.rect.x + (i % 2) * w,
            this.rect.y + Math.floor(i * 0.5) * h,
            w,
            h
          ),
          this.depth + 1
        )
      );

    for (let item of this.items) {
      const binIndex = this._getBinIndex(item.x, item.y);
      if (binIndex != -1) this.bins[binIndex].addItem(item);
    }

    this.items = null;
  }

  debugRender(renderingContext) {
    noFill();
    stroke("#aaa");
    strokeWeight(1);
    rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    if (this.bins) for (let b of this.bins) b.debugRender(renderingContext);
  }

  _getBinIndex(x, y, range = 0) {
    if (!this.checkWithinExtent(x, y)) return -1;
    let w = this.rect.width * 0.5,
      h = this.rect.height * 0.5;
    let xx = Math.floor((x - this.rect.x) / w);
    let yy = Math.floor((y - this.rect.y) / h);
    return xx + yy * 2;
  }
}

class QuadTree {
  constructor(maxDepth, maxItemsPerBin, extent) {
    this.extent = extent.copy();
    this.maxDepth = maxDepth;
    this.maxItemsPerBin = maxItemsPerBin;
    this.clear();
  }

  clear() {
    this.rootBin = new QuadTreeBin(
      this.maxDepth,
      this.maxItemsPerBin,
      new Rect(0, 0, this.extent.width, this.extent.height)
    );
  }

  addItem(x, y, item) {
    this.rootBin.addItem(new QuadTreeItem(x, y, item));
  }

  getItemsInRadius(x, y, radius, maxItems) {
    if (maxItems === undefined) {
      return this.rootBin.getItemsInRadius(x, y, radius);
    } else {
      return this.rootBin
        .getItemsInRadius(x, y, radius)
        .sort((a, b) => a.distSqrd - b.distSqrd)
        .slice(0, maxItems)
        .map((v) => v.data);
    }
  }

  debugRender(renderingContext) {
    //this.rootBin.debugRender(renderingContext);
  }
}

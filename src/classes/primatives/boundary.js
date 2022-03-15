import { Vector } from 'p5'

/**
 * A Boundary is a line made of two points, in our 2D space.
 * These boundaries can be used on their own, or as part of a
 * collection of boundaries to make more complicated shapes.
 */

class Boundary {
  constructor (x1, y1, x2, y2, red, green, blue) {
    this.start = new Vector(x1, y1);
    this.end = new Vector(x2, y2);
    this.color = [red, green, blue];
  }

  show () {
    window.p5.stroke(255); // Debug using just white for now, add color later.
    window.p5.strokeWeight(5);
    window.p5.line(this.start.x, this.start.y, this.end.x, this.end.y);
  }
}

export default Boundary;
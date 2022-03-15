import { Vector } from 'p5'

class Ray {
  constructor (position, angle) {
    this.position = position; // The position of where the ray starts
    this.angle = angle; // The angle of the ray
    this.direction = Vector.fromAngle(this.angle); // The direction of the ray
  }

  setAngle (angle) {
    this.angle = angle;
    this.direction = Vector.fromAngle(this.angle);
  }

  show () {
    // Debug casting out a line from the player's position to the end of the ray
    window.p5.stroke(255, 5);
    window.p5.push(); // I have zero idea what this does...
    window.p5.translate(this.position.x, this.position.y);
    window.p5.line(0, 0, this.direction.x * 100, this.direction.y * 100);
    window.p5.pop(); // Clear something to do with the push(), but still no idea what it does...
  }

  cast (boundary) {
    const x1 = boundary.start.x;
    const y1 = boundary.start.y;
    const x2 = boundary.end.x;
    const y2 = boundary.end.y;

    const x3 = this.position.x;
    const y3 = this.position.y;
    const x4 = this.position.x + this.direction.x;
    const y4 = this.position.y + this.direction.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den == 0) {
      return;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
    if (t > 0 && t < 1 && u > 0) {
      const pt = new Vector();
      pt.x = x1 + t * (x2 - x1);
      pt.y = y1 + t * (y2 - y1);
      return pt;
    } else {
      return;
    }
  }
}

export default Ray;
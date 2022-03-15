import { Vector } from 'p5'
import Boundary from './boundary.js'

/**
 * A Wall is a collection of Boundaries.
 * NOTE: For early development purposes, this is limited to four boundaries.
 */

class Wall {
  constructor (x, y, width, height, red, green, blue) {
    this.position = new Vector(x, y);
    this.width = width;
    this.height = height;
    this.boundaries = [];
    this.color = [red, green, blue];

    const points = [];
    // It's 2:30am, I'm sleep deprived, so fuck it this bodge will do and I can refactor later.
    points.push(new Vector(x, y));
    points.push(new Vector(x + width, y));
    points.push(new Vector(x + width, y + height));
    points.push(new Vector(x, y + height));

    points.forEach((startPoint, index) => {
      const endPoint = points[index + 1] || points[0];
      let color = this.color;
      color.forEach((c, i) => color[i] = c - index * 2);
      this.boundaries.push(new Boundary(
        startPoint.x,
        startPoint.y,
        endPoint.x,
        endPoint.y,
        ...color
      ));
    })

  }

  show () {
    this.boundaries.forEach(boundary => {
      boundary.show();
    })
  }
}

export default Wall;
import { Vector } from 'p5'
import Boundary from './boundary.js'

/**
 * A Column is a collection of Boundaries, in the shape of a circle.
 * It uses a sides parameter to determine how many sides it has.
 */

class Column {
  constructor (x, y, diameter, sides, red, green, blue) {
    this.position = new Vector(x, y)
    this.diameter = diameter
    this.sides = sides
    this.boundaries = []
    this.color = [red, green, blue]

    const points = []
    // Generate points for the sides of the polygon.
    for (let i = 0; i < sides; i++) {
      const angle = i / sides * Math.PI * 2
      points.push(new Vector(
        x + Math.cos(angle) * diameter / 2,
        y + Math.sin(angle) * diameter / 2
      ))
    }

    points.forEach((startPoint, index) => {
      const endPoint = points[index + 1] || points[0];
      let color = this.color;
      color.forEach((c, i) => color[i] = c - Math.sin(index));
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
      boundary.show()
    })
  }
}

export default Column;
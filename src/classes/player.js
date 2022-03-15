import { Vector } from 'p5'
import Ray from './ray.js'

const movementSpeed = 2;
const rotationSpeed = 0.05;
const sprintMultiplier = 2;

function setupRays(rays, fov, pos, heading) {
  rays = []
  for (let angle = -(fov * 0.75); angle < (fov * 0.75); angle += 0.125) {
    rays.push(new Ray(pos, window.p5.radians(angle) + heading))
  }
  return rays
}

class Player {
  constructor () {
    this.fov = 60;
    this.position = new Vector(window.p5.width / 8, window.p5.height * 0.75);
    this.rays = [];
    this.heading = -1;

    this.rays = setupRays(this.rays, this.fov, this.position, this.heading);
  }

  setRotation (angle) {
    this.heading = angle;
    this.rays = setupRays(this.rays, this.fov, this.position, this.heading);
  }

  rotate (angle) {
    // Rotate the player
    this.heading += rotationSpeed * angle;
    this.rays = setupRays(this.rays, this.fov, this.position, this.heading);
  }

  move(direction, sprint = false) {
    // Move the player

    switch (direction) {
      case 'forward':
        this.position.add(Vector.fromAngle(this.heading).setMag(movementSpeed * (sprint ? sprintMultiplier : 1)));
        break;
      case 'backward':
        this.position.sub(Vector.fromAngle(this.heading).setMag(movementSpeed));
        break;
      case 'left':
        this.position.sub(Vector.fromAngle(this.heading + window.p5.radians(90)).setMag(movementSpeed));
        break;
      case 'right':
        this.position.add(Vector.fromAngle(this.heading + window.p5.radians(90)).setMag(movementSpeed));
        break;
    }
  }

  update (x, y) {
    // Right now just used for updating the player position
    // But, should be changed to accept a object in the future
    // to allow for more complex player movement and actions.
    this.position.set(x, y);
  }

  show () {
    // Draw the player
    window.p5.fill(255);
    const dir = Vector.fromAngle(this.heading);
    
    window.p5.ellipse(this.position.x, this.position.y, 20);

    // window.p5.push();
    // window.p5.translate(this.position.x, this.position.y);
    // window.p5.line(0, 0, dir.x * 25, dir.y * 25);
    // window.p5.pop();

    this.rays.forEach(ray => {
      ray.show();
    })
  }

  view (boundaries) {
    const scene = []
    // Foreach ray, cast it at each boundary
    this.rays.forEach((ray, rayIndex) => {
      let closestIntersectionPoint = null;
      let shortestDistance = Infinity;
      let color = [255, 255, 255];

      boundaries.forEach(boundary => {
        const intersectionPoint = ray.cast(boundary);

        if (intersectionPoint) {
          let distance = Vector.dist(this.position, intersectionPoint);
          const angle = ray.direction.heading() - this.heading;
          
          distance *= Math.cos(angle);

          if (distance < shortestDistance) {
            shortestDistance = distance;
            closestIntersectionPoint = intersectionPoint;
            color = boundary.color;
          }
        }
      });
      if (closestIntersectionPoint) {
        const { x, y } = closestIntersectionPoint
        // window.p5.fill(255)
        // window.p5.ellipse(x, y, 10)

        // window.p5.stroke(255, 100);
        // window.p5.line(this.position.x, this.position.y, x, y);
      }
      scene[rayIndex] = {
        distance: shortestDistance,
        color
      };
    });
    return scene;
  }
}

export default Player;
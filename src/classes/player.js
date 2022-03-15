import { Vector } from 'p5'
import Ray from './ray.js'

function setupRays(rays, fov, pos, heading) {
  rays = []
  for (let angle = -(fov * 0.75); angle < (fov * 0.75); angle += 0.125) {
    rays.push(new Ray(pos, window.p5.radians(angle) + heading))
  }
  return rays
}

class Player {
  constructor () {
    this.movementSpeed = 2
    this.rotationSpeed = 0.05
    this.sprintMultiplier = 2
    this.fov = 60
    this.radius = 20
    this.position = new Vector(window.p5.width / 8, window.p5.height * 0.75)
    this.rays = []
    this.heading = -1

    this.rays = setupRays(this.rays, this.fov, this.position, this.heading)
  }

  setRotation (angle) {
    this.heading = angle
    this.rays = setupRays(this.rays, this.fov, this.position, this.heading)
  }

  rotate (angle) {
    // Rotate the player
    this.heading += this.rotationSpeed * angle
    this.rays = setupRays(this.rays, this.fov, this.position, this.heading)
  }

  move(direction, sprint = false) {
    // Move the player

    switch (direction) {
      case 'forward':
        this.position.add(Vector.fromAngle(this.heading).setMag(this.movementSpeed * (sprint ? this.sprintMultiplier : 1)))
        break
      case 'backward':
        this.position.sub(Vector.fromAngle(this.heading).setMag(this.movementSpeed))
        break
      case 'left':
        this.position.sub(Vector.fromAngle(this.heading + window.p5.radians(90)).setMag(this.movementSpeed))
        break
      case 'right':
        this.position.add(Vector.fromAngle(this.heading + window.p5.radians(90)).setMag(this.movementSpeed))
        break
    }
  }

  update (x, y) {
    // Right now just used for updating the player position
    // But, should be changed to accept a object in the future
    // to allow for more complex player movement and actions.
    this.position.set(x, y)
  }

  show () {
    // Draw the player
    window.p5.fill(255)
    window.p5.ellipse(this.position.x, this.position.y, this.radius)

    this.rays.forEach(ray => {
      ray.show()
    })
  }

  view (boundaries) {
    const scene = []
    // Foreach ray, cast it at each boundary
    this.rays.forEach((ray, rayIndex) => {
      let closestIntersectionPoint = null
      let shortestDistance = Infinity
      let color = [255, 255, 255]

      boundaries.forEach(boundary => {
        const intersectionPoint = ray.cast(boundary)

        if (intersectionPoint) {
          let distance = Vector.dist(this.position, intersectionPoint)
          const angle = ray.direction.heading() - this.heading
          
          distance *= Math.cos(angle)

          if (distance < shortestDistance) {
            shortestDistance = distance
            closestIntersectionPoint = intersectionPoint
            color = boundary.color
          }
        }
      })

      scene[rayIndex] = {
        distance: shortestDistance,
        color
      }
    })
    
    return scene
  }
}

export default Player
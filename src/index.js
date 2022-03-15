import './styles/main.styl'

import p5 from 'p5';
import Player from './classes/player.js';
import Wall from './classes/wall.js';

const sceneW = window.innerWidth;
const sceneH = window.innerHeight;

let squareSceneSize = sceneW;
if (sceneH < squareSceneSize) squareSceneSize = sceneH;

squareSceneSize = squareSceneSize * 1;

const minimapSize = squareSceneSize * 0.35;

window.scene = {
  width: squareSceneSize,
  height: squareSceneSize
}

const wallColors = {
  gray: [255, 238, 207],
  accent: [244, 91, 105],
  blue: [6, 133, 199],
  door: [72, 61, 63]
}

let walls = [
  new Wall(0, 0, squareSceneSize, squareSceneSize, ...wallColors.blue),
  new Wall(80, 80, 200, 20, ...wallColors.gray),
  new Wall(80, 120, 20, 200, ...wallColors.gray),
  new Wall(280, 120, 20, 200, ...wallColors.gray),
  new Wall(280, 80, 200, 20, ...wallColors.gray),

  new Wall(550, 200, 60, 60, ...wallColors.accent),

  new Wall(750, 0, 20, 400, ...wallColors.gray),
  new Wall(750, 500, 20, 400, ...wallColors.gray),
  new Wall(950, 300, 20, 400, ...wallColors.gray),
  new Wall(850, 100, 300, 20, ...wallColors.gray),

  new Wall(755, 400, 10, 100, ...wallColors.door) // pretend door, will add a door class soon:tm:
];
let player;

let pointerLocked = false;

window.p5 = new p5(sketch => {
  sketch.setup = () => {
    const canvas = sketch.createCanvas(sceneW, sceneH, p5.WEBGL);
    player = new Player();
    canvas.id('engine');
  }

  sketch.mouseClicked = () => {
    sketch.requestPointerLock();
  }

  sketch.draw = () => {
    sketch.background(53, 57, 63); // Copied from the example code, but wouldn't it make more sense to have this in the setup?

    // Handle player movement
    handlePlayerMovement(sketch, player);

    const scene = player.view(walls.flatMap(wall => wall.boundaries)); // Cast rays at walls, don't like having to pass in walls every time...

    // Draw scene
    const distortionProjectPlane = sketch.width / 3.0 / Math.tan(player.fov / 2.0);
    const w = sketch.width / scene.length;
    sketch.push();
    scene.forEach((tile, i) => {
      const { distance, color } = tile
      sketch.noStroke();
      const sq = distance * distance;
      const wSq = sketch.width * sketch.width;

      const b = sketch.map(sq, 0, wSq, 255, 0) / 5;
      const h = (sketch.width / distance) * distortionProjectPlane / 2;
      // const h = sketch.map(tile, 0, sketch.width, sketch.height / 2, 0);

      const colorWithBrightness = sketch.color(color[0] - b, color[1] - b, color[2] - b);

      sketch.fill(colorWithBrightness);
      sketch.rectMode(sketch.CENTER);
      sketch.rect(i * w + w / 2, sketch.height / 2, w + 1, h);
    })
    sketch.pop();


    sketch.push();
    sketch.translate(sceneW - minimapSize, sceneH - minimapSize);
    sketch.scale(0.35, 0.35);
    sketch.fill(0, 25);
    sketch.rect(0, 0, squareSceneSize, squareSceneSize);
    sketch.noFill();
    sketch.stroke(255);
    sketch.strokeWeight(10);
    sketch.rect(0, 0, squareSceneSize, squareSceneSize);

    // Draw overlay
    walls.forEach(wall => {
      wall.show();
    })
    player.show();

    sketch.pop();
  }
});

function handlePlayerMovement(sketch, player) {
  // Handle left/right movement
  if (sketch.keyIsDown(65)) {
    player.move("left");
  };
  if (sketch.keyIsDown(68)) {
    player.move("right");
  };

  // Handle forward/backward movement
  if (sketch.keyIsDown(87)) {
    player.move("forward", sketch.keyIsDown(16))
  };

  if (sketch.keyIsDown(83)) {
    player.move("backward")
  };

  // Handle rotation
  const rotation = Math.max(-1, Math.min(1, sketch.movedX))
  player.rotate(rotation);
}
import { EventEmitter } from 'aion-events';
import { Box, Circle, Polygon, Sat, Shape, vec, Vector } from 'aionsat';
import { Body, CollisionData, CollisionEvents, Time, World } from '../dist';

// Create canvas
const canvas = document.createElement('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
ctx.strokeStyle = 'white';

// Create bodies
const square = new Body({
    shape: new Box(10, 10),
    pos: new Vector(200, 150),
    vel: new Vector(0, 0)
});

const square2 = new Body({
    shape: new Box(1, 100),
    pos: new Vector(800, 200),
    vel: new Vector(-10, 0)
});

const floor = new Body({
    shape: new Box(innerWidth, 10),
    pos: new Vector(0, window.innerHeight - 50),
    behavior: Body.Behaviors.Static
});

const wallLeft = new Body({
    shape: new Box(10, innerHeight),
    pos: new Vector(0, 0),
    behavior: Body.Behaviors.Static
});

const wallRight = new Body({
    shape: new Box(10, innerHeight),
    pos: new Vector(innerWidth - 10, 0),
    behavior: Body.Behaviors.Static
});

const roof = new Body({
    shape: new Box(innerWidth, 10),
    pos: new Vector(0, 0),
    behavior: Body.Behaviors.Static
});

document.body.onmousemove = (e) => {
    //square.pos = new Vector(e.clientX, e.clientY);
};

document.body.onkeydown = (e) => {
    const speed = 18 //* Time.scaleFactor;
    switch (e.key) {
        case 'ArrowLeft':
            square.vel = square.vel.add(new Vector(-speed, 0));
            //square.vel.x = -speed;
            break;
        case 'ArrowRight':
            square.vel = square.vel.add(new Vector(speed, 0));
            break;
        case 'ArrowUp':
            square.vel = square.vel.add(new Vector(0, -speed));
            break;
        case 'ArrowDown':
            square.vel = square.vel.add(new Vector(0, speed));
            break;
        case ' ':
            square.vel = square.vel.add(new Vector(0, -20));
        default:
            break;
    }
};
// Create bodies
const bodies = [square, square2, wallLeft, wallRight, floor, roof, ...createBodies(0)];

// Create world
const world = new World({
    bodies,
    gravity: new Vector(0, 0.1),
    iterations: 10
});

// Listen for collisions
const eventDispatcher = new EventEmitter();
eventDispatcher.on(CollisionEvents.PostSolve, ({ bodyA, bodyB, normal, overlap }: CollisionData) => {
    if (bodyB.isStatic) return;
    if (bodyA.vel.x > normal.x && bodyA.vel.y > normal.y) {
        const force = bodyB.vel.sub(normal);
        bodyB.vel = force;
    }
});

world.wire(eventDispatcher);


// Launch loop
(function loop() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    world.step();

    bodies.forEach(draw);

    requestAnimationFrame(loop);
})();

//----------------------------UTILS-----------------------------------------------

function createBodies(n = 1, size = 50) {
    const bodies = [];
    for (let i = 0; i < n; i++) {
        const body = new Body({
            shape: Math.random() > 0.5 ? new Box(Math.random() * size, Math.random() * size) : new Circle(Math.random() * size),
            pos: new Vector(Math.random() * 500, Math.random() * 500),
            vel: new Vector(
                Math.random() * 10 * Math.random() > 0.5 ? -1 : 1,
                Math.random() * 10 * Math.random() > 0.5 ? -1 : 1
            )
        });
        bodies.push(body);
    }
    return bodies;
}

function draw(body: Body) {
    if (body.shape instanceof Polygon) {
        drawPolygon(body.shape);
    }
    if (body.shape instanceof Circle) {
        drawCircle(body.shape);
    }
}

function drawPolygon(polygon: Polygon, color = 'white') {
    ctx.strokeStyle = color;
    ctx.beginPath();
    polygon.vertices.forEach((v, i) => {
        if (i === 0) {
            ctx.moveTo(v.x, v.y);
        } else {
            ctx.lineTo(v.x, v.y);
        }
    });
    ctx.closePath();
    ctx.stroke();
}

function drawCircle(circle: Circle, color = 'white') {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(circle.pos.x, circle.pos.y, circle.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
}

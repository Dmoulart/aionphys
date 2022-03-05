import { Box, Circle, Polygon, Sat, Shape, vec, Vector } from 'aionsat';
import { Body, World } from '../dist';

// Create canvas
const canvas = document.createElement('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
ctx.strokeStyle = 'white';

// Create bodies
const square = new Body({
    shape: new Box(100, 100),
    pos: new Vector(200, 150),
    vel: new Vector(10, 0)
});

const square2 = new Body({
    shape: new Box(100, 100),
    pos: new Vector(800, 200),
    vel: new Vector(-30, 0)
});


document.body.onmousemove = (e) => {
    square.pos = new Vector(e.clientX, e.clientY);
}
const bodies = [square, square2, ...createBodies(10)];

// Create world
const world = new World({ bodies });

// Launch loop
(function loop() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    world.step();

    bodies.forEach(draw);

    requestAnimationFrame(loop);
})();

//----------------------------UTILS-----------------------------------------------

function createBodies(n = 1) {
    const bodies = [];
    for (let i = 0; i < n; i++) {
        const body = new Body({
            shape: new Box(Math.random() * 100, Math.random() * 100),
            pos: new Vector(Math.random() * 500, Math.random() * 500),
            vel: new Vector(Math.random() * 50 * Math.random() > 0.5 ? -1 : 1, Math.random() * 50 * Math.random() > 0.5 ? -1 : 1)
        })
        bodies.push(body);
    }
    return bodies
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

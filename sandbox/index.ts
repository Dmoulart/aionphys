
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
const body = new Body({
    shape: new Circle(100),
    pos: new Vector(200, 200),
    vel: new Vector(10, 0)
});
const bodies = [body];

// Create world
const world = new World({ bodies });


// Launch loop
(function loop() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    world.step()

    draw(body)

    requestAnimationFrame(loop);
})();




//----------------------------UTILS-----------------------------------------------

function resolve(collision: { overlap: number; normal: Vector }, shape: Shape) {
    shape.pos = shape.pos.add(collision.normal.scale(collision.overlap + 1));
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


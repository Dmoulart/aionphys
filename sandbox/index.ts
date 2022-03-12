import { EventEmitter } from 'aion-events';
import { Box, Circle, Polygon, Sat, Shape, vec, Vector } from 'aionsat';
import { Body, CollisionData, CollisionEvents, Time, World, AABBSpatialBroadphase, AABBBruteBroadphase, NaiveBroadphase, ImpulseSolver, ArcadeSolver } from '../dist';

// Create canvas
const canvas = document.createElement('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
ctx.strokeStyle = 'white';

// Add counter
const BODY_COUNT = 0;
bodyCounter(BODY_COUNT);

// Add iterations counter
const ITERATIONS = 4
iterationsCounter(ITERATIONS);

// Create bodies
const square = new Body({
    shape: new Box(10, 10),
    pos: new Vector(200, 150),
    vel: new Vector(0, 0),
    data: { name: "player", color: "red" }
});

const square2 = new Body({
    shape: new Box(100, 100),
    pos: new Vector(400, 400),
    vel: new Vector(0, 0),
    mass: 0.1,
    data: { name: "other", color: "blue" }
});

const square3 = new Body({
    shape: new Box(100, 100),
    pos: new Vector(400, 200),
    vel: new Vector(-5, 0),
    data: { name: "otherB" }
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

function popBodiesonclick(e) {
    for (let i = 0; i < 10; i++) {
        const body = createBody(
            e.clientX + Math.random() * 50,
            e.clientY + Math.random() * 50,
            50,
            0
        );
        world.bodies.push(body);
    }

    bodyCounter(world.bodies.length);
    //square.pos = new Vector(e.clientX, e.clientY);
}

const moveBody = (body) => (e) => {
    const speed = 2
    switch (e.key) {
        case 'ArrowLeft':
            square.vel = square.vel.add(new Vector(-speed, 0));
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
            break;
        default:
            break;
    }
}

document.body.onclick = popBodiesonclick

// document.body.onmousemove = (e) => {
//     square.pos = new Vector(e.clientX, e.clientY);
// }

document.body.onkeydown = moveBody(square)

// Create bodies
const bodies = [
    square,
    square2,
    wallLeft,
    wallRight,
    floor,
    roof,
    ...createBodies(BODY_COUNT)
];

// Create world
const world = new World({
    bodies,
    gravity: new Vector(0, 1),
    broadphase: new AABBSpatialBroadphase(),
    solver: new ImpulseSolver(),
    iterations: ITERATIONS
});

// Listen for collisions
const eventDispatcher = new EventEmitter();
eventDispatcher.on(CollisionEvents.PostSolve, ({ bodyA, bodyB, normal, overlap }: CollisionData) => {
});

world.wire(eventDispatcher);


// Launch loop
(function loop() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    world.step();
    bodies.forEach(draw);
    //fpsCounter(Time.dt);
    requestAnimationFrame(loop);
})();

//----------------------------UTILS-----------------------------------------------

function createBodies(n = 1, size = 50) {
    const bodies = [];
    for (let i = 0; i < n; i++) {
        const body = createBody(Math.random() * innerWidth, Math.random() * innerHeight, size);
        bodies.push(body);
    }
    return bodies;
}

function createBody(posx: number, posy: number, size: number, vel = 10) {
    return new Body({
        shape: Math.random() > 0.5 ? new Box(Math.random() * size, Math.random() * size) : new Circle(Math.random() * size),
        pos: new Vector(posx, posy),
        vel: new Vector(
            Math.random() * vel * Math.random() > 0.5 ? -1 : 1,
            Math.random() * vel * Math.random() > 0.5 ? -1 : 1
        )
    });
}

//----------------------------RENDER-----------------------------------------------

function draw(body: Body) {
    if (body.shape instanceof Polygon) {
        drawPolygon(body.shape, body.data.color ?? 'white');
    }
    if (body.shape instanceof Circle) {
        drawCircle(body.shape, body.data.color ?? 'white');
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

function iterationsCounter(iterations: number) {
    let el = document.querySelector('#iterations-count')
    console.log(el)
    if (!el) {
        createIndicator(`${iterations} iterations`, 5, 15, 'iterations-count')
    }
    else {
        el = createIndicator(`${iterations} iterations`, 5, 15, 'iterations-count')
    }
}

function bodyCounter(bodyCount: number) {
    let el = document.querySelector('#body-count')
    console.log(el)
    if (!el) {
        createIndicator(`${bodyCount} bodies`, 5, 5, 'body-count')
    }
    else {
        el.innerHTML = `${bodyCount} bodies`
    }
}


function fpsCounter(fps: number) {
    this.frame ??= 0
    this.frame += 1
    // this.timeStart ??= performance.now()
    // this.timeNow = performance.now()

    // fps = (this.frame / (this.timeNow - this.timeStart))
    if (this.frame > 10) {
        fps = Math.round(Time.dt * 1000 * 60)
        // Calculate frames per seconds


        let el = document.querySelector('#fps-count')
        console.log(el)
        if (!el) {
            createIndicator(`${fps} DT`, 5, 1, 'fps-count')
        }
        else {
            el.innerHTML = `${fps} DT`
        }
        this.frame = 0
    }



}


function createIndicator(content: string | number, left: number, top: number, id: string) {
    const div = document.createElement('div');
    div.id = id;
    div.innerHTML = `${content}`;
    div.style.position = 'absolute';
    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    div.style.width = '200px';
    div.style.height = '120px';
    div.style.left = `${left}vw`;
    div.style.top = `${top}vh`;
    div.style.color = 'white';
    div.style.fontSize = '2rem';
    div.style.alignItems = 'center';
    div.style.zIndex = '9999';
    if (!document.querySelector(`#${id}`)) {
        document.body.appendChild(div);
    }

    return div
}


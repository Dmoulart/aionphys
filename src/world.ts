import { Body } from './body';
import { NaiveBroadphase } from './broadphase';
import { BroadphaseInterface } from './broadphase/broadphase-interface';
import { CollisionDetectorInterface } from './detector';
import { SatDetector } from './detector/sat-detector';
import { ArcadeSolver, CollisionData, CollisionEvents, CollisionSolverInterface, SolverEvents } from './solver';
import { EventEmitter, Fire, On } from 'aion-events';
import { emit } from 'process';
import { Vector } from 'aionsat';
import { BodyBehaviors } from './body-behavior';
import { Time } from './time';

/**
 * The world initialization attributes.
 * 
 */
export type WorldOptions = {
  /**
   * The bodies to add to the world.
   */
  bodies: Body[];

  /**
   * The broadphase implementaiton to use.
   */
  broadphase?: BroadphaseInterface;

  /**
   * The collision detector implementation to use.
   */
  detector?: CollisionDetectorInterface;

  /**
   * The collision solver implementation to use.
   */
  solver?: CollisionSolverInterface;

  /**
   * The gravity constant. Apply at every iteration step.
   */
  gravity?: Vector;

  /**
   * The deceleration constant. Apply at every iteration step.
   */
  deceleration?: number;

  /**
   * The iteration number. That is to say the number of times the world 
   * will move bodies and calculate collisions by step.
   */
  iterations?: number;
};

/**
 * The world is the container for all physics bodies in the simulation.
 * It also orchestrate the collision detection and resolution.
 *
 */
export class World extends EventEmitter {
  /**
   * The world's bodies.
   *
   */
  private _bodies: Body[] = [];

  /**
   * The broadphase implementation. Its role is to extract pairs of bodies which are potentially colliding.
   *
   */
  private _broadphase!: BroadphaseInterface;

  /**
   * The collision detector used to detect and analyze collisions between bodies.
   *
   */
  private _detector!: CollisionDetectorInterface;

  /**
   * The collision solver is used to process the collision between bodies. It adjusts the bodies velocities
   * and positions depending on the collision data.
   *
   */
  private _solver!: CollisionSolverInterface;

  /**
   * The gravity force applied to all bodies in the world.
   *
   */
  private _gravity: Vector = Vector.origin;

  /**
   * The deceleration constant. It is applied at every step to every bodies.
   *
   */
  private readonly _DECELERATION: number = 0.97;

  /**
   * The number of iterations per step. It allows us to control the accuracy of the simulation 
   * at the cost of performance.
   * 
   */
  private readonly _ITERATIONS: number = 3


  public constructor(options: WorldOptions) {
    super();
    const { bodies, broadphase, detector, solver, gravity, deceleration, iterations } = options;
    this.bodies = bodies;
    this.broadphase = broadphase ?? new NaiveBroadphase();
    this.detector = detector ?? new SatDetector();
    this.solver = solver ?? new ArcadeSolver();
    this.gravity = gravity ?? this.gravity;
    this._DECELERATION = deceleration ?? this._DECELERATION;
    this._ITERATIONS = iterations ?? this._ITERATIONS;
  }

  /**
   * Update the world bodies positions by performing collision detections and resolution.
   *
   * @returns nothing
   */
  public step(): void {
    // Caclculate the delta time.
    Time.dt = Time.now - Time.lastFrameTime;

    // Initialize the iteration counter.
    let currentIteration = 1;

    while (currentIteration <= this._ITERATIONS) {
      // Update the positions of the bodies in the world.
      this.translateBodies();

      // Detect pair of bodies which are potentially colliding.
      const pairs = this.broadphase.pair(this.bodies);

      for (let i = 0; i < pairs.length; i++) {
        // Extract pair
        const { bodyA, bodyB } = pairs[i];

        // Detect collision
        const collision = this.detector.intersects(bodyA, bodyB);

        // Resolve collision
        if (collision) {
          this.solver.solve({ ...collision, bodyA, bodyB });
        }
      }
      currentIteration++
    }

    // // Save the last frame time
    Time.lastFrameTime = Time.now;
  }

  /**
   * Update all the bodies positions.
   *
   * @returns nothing
   */
  private translateBodies(): void {
    const len = this.bodies.length;

    for (let i = 0; i < len; i++) {
      // Static bodies don't move.
      if (this.bodies[i].isStatic) continue;

      // Register the original starting velocity of the body.
      this.bodies[i].stepVel = this.bodies[i].vel

      // Make the body decelerate.
      this.decelerate(this.bodies[i]);

      // Update positions of the bodies relative to their velocity.
      this.translate(this.bodies[i]);

      // Update bodie's velocities.
      this.applyGravity(this.bodies[i]);
    }
  }

  /**
   * Decrease the bodie's velocity using the deceleration coefficient.
   *
   * @param body
   * @returns nothing
   */
  private decelerate(body: Body): void {
    body.vel = body.stepVel
      .scale(this._DECELERATION)
      .div(new Vector(this._ITERATIONS, this._ITERATIONS));
  }

  /**
   * Update the body's position.
   *
   * @param body
   * @returns nothing
   */
  private translate(body: Body): void {
    const move = body.stepVel
      .scale(Time.scaleFactor)
      .div(new Vector(this._ITERATIONS, this._ITERATIONS));
    body.pos = body.pos.add(move);
  }

  /**
   * Apply the gravity force to the body.
   *
   * @param body
   * @returns nothing
   */
  private applyGravity(body: Body): void {
    body.vel = body.stepVel.add(this._gravity);
  }

  /**
   * This event listener acts as a bridge between the solver and other event emitters which could be
   * wired to the world to get the collision events.
   *
   * @emits {collision:presolve}
   * @param collision
   * @return collision data
   */
  @On(SolverEvents.PreSolve)
  @Fire(CollisionEvents.PreSolve)
  public onCollisionPresolve(collision: CollisionData): CollisionData {
    return collision;
  }

  /**
   * This event listener acts as a bridge between the solver and other event emitters which could be
   * wired to the world to get the collision events.
   *
   * @emits {collision:postsolve}
   * @param collision
   * @return collision data
   */
  @On(SolverEvents.PostSolve)
  @Fire(CollisionEvents.PostSolve)
  public onCollisionPostsolve(collision: CollisionData): CollisionData {
    return collision;
  }

  /**
   * The world's bodies.
   *
   * @returns bodies
   */
  public get bodies(): Body[] {
    return this._bodies;
  }

  /**
   * Set the world's bodies.
   *
   * @param bodies
   */
  public set bodies(bodies: Body[]) {
    this._bodies = bodies;
  }

  /**
   * The world's broadphase detection implementation.
   *
   * @returns world's broadphase instance
   */
  public get broadphase(): BroadphaseInterface {
    return this._broadphase;
  }

  /**
   * Set the world's broadphase detection implementation.
   *
   * @param broadphase the broadphase detection implementation
   */
  public set broadphase(broadphase: BroadphaseInterface) {
    this._broadphase = broadphase;
  }

  /**
   * The world's collision detection implementation.
   *
   * @returns world's collision detector
   */
  public get detector(): CollisionDetectorInterface {
    return this._detector;
  }

  /**
   * Set the world's collision detection implementation.
   *
   * @param detector the collision detector
   */
  public set detector(detector: CollisionDetectorInterface) {
    this._detector = detector;
  }

  /**
   * The world's collision solver implementation.
   *
   * @returns world's collision solver
   */
  public get solver(): CollisionSolverInterface {
    return this._solver;
  }

  /**
   * Set the world's collision solver implementation.
   *
   * @param solver the collision solver
   */
  public set solver(solver: CollisionSolverInterface) {
    this._solver = solver;
    // Wire the solver events to the world's events
    solver.wire(this);
  }

  /**
   * The world's gravity force.
   *
   * @returns world's gravity force
   */
  public get gravity(): Vector {
    return this._gravity;
  }

  /**
   * Set the world's gravity force.
   *
   * @param gravity the gravity force
   */
  public set gravity(gravity: Vector) {
    this._gravity = gravity;
  }
}

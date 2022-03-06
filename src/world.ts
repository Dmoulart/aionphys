import { Body } from './body';
import { NaiveBroadphase } from './broadphase';
import { BroadphaseInterface } from './broadphase/broadphase-interface';
import { CollisionDetectorInterface } from './detector';
import { SatDetector } from './detector/sat-detector';
import { ArcadeCollisionSolver, CollisionSolverInterface } from './solver';

export type WorldOptions = {
  bodies: Body[];
  broadphase?: BroadphaseInterface;
  detector?: CollisionDetectorInterface;
  solver?: CollisionSolverInterface;
};

/**
 * The world is the container for all physics bodies in the simulation.
 * It also orchestrate the collision detection and resolution.
 *
 */
export class World {
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

  public constructor(options: WorldOptions) {
    const { bodies, broadphase, detector, solver } = options;
    this.bodies = bodies;
    this.broadphase = broadphase ?? new NaiveBroadphase();
    this.detector = detector ?? new SatDetector();
    this.solver = solver ?? new ArcadeCollisionSolver();
  }

  /**
   * Update the world bodies positions by performing collision detections and resolution.
   *
   * @returns nothing
   */
  public step(): void {
    this.moveBodies();

    const pairs = this.broadphase.extract(this.bodies);

    const len = pairs.length;

    for (let i = 0; i < len; i++) {
      const { bodyA, bodyB } = pairs[i];

      const collision = this.detector.intersects(bodyA, bodyB);

      if (!collision) continue;

      this.solver.solve({ ...collision, bodyA, bodyB });
    }
  }

  /**
   * Update all the bodies positions.
   *
   * @returns nothing
   */
  private moveBodies(): void {
    const len = this.bodies.length;
    for (let i = 0; i < len; i++) {
      this.moveBody(this.bodies[i]);
    }
  }

  /**
   * Update the body's position.
   *
   * @param body
   * @returns nothing
   */
  private moveBody(body: Body): void {
    body.pos = body.pos.add(body.vel);
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
  }
}

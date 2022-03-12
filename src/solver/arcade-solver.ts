import { CollisionData, CollisionSolverInterface as SolverInterface, SolverEvents } from './solver';
import { EventEmitter } from 'aion-events';
import { Vector } from 'aionsat';
/**
 * The arcade collision resolver is a simple collision resolver that adjusts the bodies position and velocity depending
 * on the collision's informations.
 * @warning Do not work well with gravity
 */
export class ArcadeSolver extends EventEmitter implements SolverInterface {
  /**
   * The debounce factor is used to move the bodies apart slightly more than the overlap.
   * It will prevents them from overlapping immediately again.
   */
  static readonly DEBOUNCE_FACTOR = 0.01;

  /**
   *
   * @inheritdoc
   */
  public solve(collision: CollisionData): void {
    this.fire(SolverEvents.PreSolve, collision);
    this.solvePosition(collision);
    this.solveVelocity(collision);
    this.fire(SolverEvents.PostSolve, collision);
  }

  /**
   * Adjust the positions of the colliding bodies.
   *
   * @param collision
   */
  private solvePosition({ a, b, normal, overlap, bodyA, bodyB }: CollisionData): void {
    // The minimum translation vector.
    let mtv;

    if (bodyA.isDynamic && bodyB.isDynamic) {
      mtv = normal.scale(overlap / 2 + ArcadeSolver.DEBOUNCE_FACTOR);
    } else {
      // If one body is static we need to move the other body totally out of the collision.
      mtv = normal.scale(overlap + ArcadeSolver.DEBOUNCE_FACTOR);
    }

    // Use the minimum translation vector to get the bodies out of contact
    if (bodyA.isDynamic) {
      a.pos = a.pos.add(mtv);
    }
    if (bodyB.isDynamic) {
      b.pos = b.pos.sub(mtv);
    }
  }

  /**
   * Ajust the velocities of the colliding bodies.
   * @warning The collisions neutralize each other velocities. Sometimes, when 3 body collides, the gravity is also annihilated by
   * this collision.
   *
   * @param collision
   */
  private solveVelocity({ normal, bodyA, bodyB }: CollisionData): void {
    const opposite = normal.negate();

    if (bodyA.isDynamic) {
      const velAdjust = normal.scale(normal.dot(bodyA.stepVel.negate()));
      bodyA.vel = bodyA.stepVel.add(velAdjust);
    }

    if (bodyB.isDynamic) {
      const velAdjust = opposite.scale(normal.dot(bodyB.stepVel));
      bodyB.vel = bodyB.stepVel.add(velAdjust);
    }

  }
}

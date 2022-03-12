import { CollisionData, CollisionSolverInterface as SolverInterface, SolverEvents } from './solver';
import { EventEmitter } from 'aion-events';
import { Vector } from 'aionsat';
/**
 * The impulse collision resolver is a simple collision resolver used for study.
 * It resolves the velocity by calculating an impulse.
 */
export class ImpulseSolver extends EventEmitter implements SolverInterface {
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
      mtv = normal.scale(overlap / 2);
    } else {
      // If one body is static we need to move the other body totally out of the collision.
      mtv = normal.scale(overlap);
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
   * Ajust the velocities of the colliding bodies by calculating and applying an impulse.
   *
   * @param collision
   */
  private solveVelocity({ normal, bodyA, bodyB }: CollisionData): void {
    // Get the minimum value from the two bodies restitutions.
    const elasticity = Math.min(bodyA.restitution, bodyB.restitution);

    // Calculate the difference in velocity.
    const relativeVelocity = bodyA.vel.sub(bodyB.vel);

    // Calculating the impulse length
    const impulseMagnitude = -(1 + elasticity) * relativeVelocity.dot(normal) / (bodyA.inversedMass + bodyB.inversedMass);

    // Project the impulse along the collision normal
    const impulseDirection = normal
    const impulse = impulseDirection.scale(impulseMagnitude);

    // Apply the impulse to the bodies
    if (bodyA.isDynamic) {
      bodyA.vel = bodyA.vel.add(impulse);
    }

    if (bodyB.isDynamic) {
      bodyB.vel = bodyB.vel.sub(impulse);
    }

  }
}

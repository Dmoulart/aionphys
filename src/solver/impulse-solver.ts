import { CollisionData, CollisionSolverInterface as SolverInterface, SolverEvents } from './solver';
import { EventEmitter } from 'aion-events';
import { Vector } from 'aionsat';
/**
 * The impulse collision resolver is a simple collision resolver used for study
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
    const relativeVel = bodyA.vel.sub(bodyB.vel);
    const relativeVelAlongNormal = relativeVel.dot(normal);
    const coefficientOfRestitution = 0.8;
    //const newRelativeVel = 
  }

  /**
   * Ajust the velocities of the colliding bodies.
   *
   * @param collision
   */
  private solveVelocity({ normal, bodyA, bodyB, overlap }: CollisionData): void {

  }
}

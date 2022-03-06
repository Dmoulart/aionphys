import { EventEmitter } from 'aion-events';
import { Collision } from 'aionsat';
import { Body } from '../body';
import { BodyPair } from '../broadphase/body-pair';

/**
 * The different collision events hook
 */
export enum CollisionEvents {
  PreSolve = 'collision:presolve',
  PostSolve = 'collision:presolve',
}

/**
 * The solver events are fired when the solver is solving the collisions.
 * They are private events which should be listened by the world which then redispatch them to the bodies.
 * 
 */
export enum SolverEvents {
  PreSolve = 'solver:presolve',
  PostSolve = 'solver:presolve',
}

/**
 * The collision data used to resolve the collision.
 */
export type CollisionData = Collision & BodyPair;

/**
 * The collision resolver is responsible for solving the collision between two bodies.
 */
export interface CollisionSolverInterface extends EventEmitter {
  /**
   * Solve the collision between two bodies by adjusting bodies position's and velocities.
   *
   * @param collision the collision data
   * @returns nothing
   **/
  solve(collision: CollisionData): void;
}

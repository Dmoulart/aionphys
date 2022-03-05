import { Collision } from 'aionsat';
import { Body } from '../body';

/**
 * The collision data used to resolve the collision.
 */
export type CollisionData = Collision & { bodyA: Body, bodyB: Body };

/**
 * The collision resolver is responsible for solving the collision between two bodies.
 */
export interface CollisionSolverInterface {
    /**
     * Solve the collision between two bodies by adjusting bodies position's and velocities.
     *
     * @param collision the collision data
     * @returns nothing
     **/
    solve(collision: CollisionData): void;
}

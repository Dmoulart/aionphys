import { Collision, Vector } from 'aionsat';
import { CollisionData, CollisionSolverInterface } from './collision-solver';

/**
 * The arcade collision resolver is a simple collision resolver that adjusts the bodies position and velocity depending
 * on the collision's informations.
 */
export class ArcadeCollisionSolver implements CollisionSolverInterface {
    /**
     *
     * @inheritdoc
     */
    public solve(collision: CollisionData): void {
        this.solvePosition(collision)
        this.solveVelocity(collision)
    }

    /**
     * Adjust the positions of the colliding bodies.
     * 
     * @param collision 
     */
    private solvePosition({ a, b, normal, overlap }: CollisionData): void {
        // Get the minimum translation vector
        const mtv = normal.scale(overlap / 2)
        // Use the minimum translation vector to get the bodies out of contact
        a.pos = a.pos.add(mtv);
        b.pos = b.pos.sub(mtv);
    }

    /**
     * Ajust the velocities of the colliding bodies.
     * 
     * @param collision 
     */
    private solveVelocity({ normal, bodyA, bodyB }: CollisionData): void {
        {
            const velAdjust = normal.scale(normal.dot(bodyA.vel.negate()));
            bodyA.vel = bodyA.vel.add(velAdjust);
            console.log(normal, velAdjust)
        }
        {
            const velAdjust = normal.scale(normal.dot(bodyB.vel.negate()));
            bodyB.vel = bodyB.vel.add(velAdjust);
            console.log(normal, velAdjust)
        }
    }
}
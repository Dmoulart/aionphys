import { Body } from '../body';
import { BroadphaseInterface } from './broadphase-interface';
import { BodyPair } from './body-pair';

/**
 * A naive broadphase implementation using axis aligned bounding box.
 *
 */
export class AABBBroadphase implements BroadphaseInterface {
  /**
   * @inheritdoc
   */
  public pair(bodies: Body[]): BodyPair[] {
    const pairs: Array<BodyPair> = []
    for (let i = 0; i < bodies.length; i++) {
      for (let j = 0; j < bodies.length; j++) {
        // Skip the same body.
        if (i === j) continue;

        const intersects = bodies[i].aabb().intersects(bodies[j].aabb())

        if (!intersects) continue

        pairs.push({
          bodyA: bodies[i],
          bodyB: bodies[j]
        });


      }
    }
    return pairs
  }
}

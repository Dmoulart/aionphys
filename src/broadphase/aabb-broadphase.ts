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
    const pairs: BodyPair[] = [];
    for (let i = 0; i < bodies.length; i++) {
      for (let j = 0; j < bodies.length; j++) {
        // Skip the same body.
        if (i === j) continue;

        // Remove pair duplicates.
        if (pairs.some((pair) => pair.bodyA === bodies[j] && pair.bodyB === bodies[i])) continue;

        pairs.push({
          bodyA: bodies[i],
          bodyB: bodies[j]
        });
      }
    }
    return pairs;
  }
}

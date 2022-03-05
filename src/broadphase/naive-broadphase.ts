import { Body } from '../body';
import { BroadphaseInterface } from './broadphase-interface';
import { BodyPair } from './body-pair';

/**
 * A really naive broadphase implementation.
 *
 */
export class NaiveBroadphase implements BroadphaseInterface {
  /**
   * @inheritdoc
   */
  public extract(bodies: Body[]): BodyPair[] {
    const pairs: BodyPair[] = [];
    for (let i = 0; i < bodies.length; i++) {
      for (let j = 0; j < bodies.length; j++) {
        if (i === j) continue;
        pairs.push({
          bodyA: bodies[i],
          bodyB: bodies[j]
        });
      }
    }
    return pairs;
  }
}

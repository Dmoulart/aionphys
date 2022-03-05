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
      for (let j = i + 1; j < bodies.length; j++) {
        pairs.push({
          bodyA: bodies[i],
          bodyB: bodies[j]
        });
      }
    }
    return pairs;
  }
}

import { Body } from '../body';
import { BroadphaseInterface } from './broadphase-interface';
import { BodyPair } from './body-pair';
import { World } from '../world';

/**
 * A naive broadphase implementation using axis aligned bounding box.
 *
 */
export class AABBBruteBroadphase implements BroadphaseInterface {

  /**
   * A reference to the simulation world.
   */
  world!: World;

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



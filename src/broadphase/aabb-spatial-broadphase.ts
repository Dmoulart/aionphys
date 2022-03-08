import { Body } from '../body';
import { BroadphaseInterface } from './broadphase-interface';
import { BodyPair } from './body-pair';
import { World } from '../world';
import { AABB } from '../math/aabb';
import { Box, Vector } from 'aionsat';

/**
 * A broadphase implementation which use axis aligned bounding box and divide space into cells.
 *
 */
export class AABBSpatialBroadphase implements BroadphaseInterface {

  /**
   * A reference to the simulation world.
   */
  world!: World;

  /**
   * @inheritdoc
   */
  public pair(bodies: Body[]): BodyPair[] {
    const pairs: BodyPair[] = [];

    // Get the world's bounds
    const { bounds } = this.world;

    // Get all world's spatial infos
    const {
      topLeft,
      topCenter,
      midLeft,
      halfWidth,
      halfHeight,
      center
    } = bounds;

    const cells: Record<string, { aabb: AABB, bodies: Array<Body> }> = {
      topLeft: {
        aabb: AABB.from(
          new Box(halfWidth, halfHeight, topLeft)
        ),
        bodies: []
      },
      topRight: {
        aabb: AABB.from(
          new Box(halfWidth, halfHeight, topCenter)
        ),
        bodies: []
      },
      bottomLeft: {
        aabb: AABB.from(
          new Box(halfWidth, halfHeight, midLeft)
        ),
        bodies: []
      },
      bottomRight: {
        aabb: AABB.from(
          new Box(halfWidth, halfHeight, center)
        ),
        bodies: []
      }
    }

    // Divide the bodies into cells
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i];
      const aabb = body.aabb();

      for (let k in cells) {
        const cell = cells[k];

        if (cell.aabb.intersects(aabb)) {
          cell.bodies.push(body);
        }
      }
    }

    console.log(cells)

    // Check for collision inside each cells
    for (let c = 0; c < Object.entries(cells).length; c++) {
      const [key, cell] = Object.entries(cells)[c];
      const len = cell.bodies.length;

      for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {

          // Skip the same body.
          if (i === j) continue;

          if (!cell.bodies[i].aabb().intersects(cell.bodies[j].aabb())) continue

          pairs.push({
            bodyA: cell.bodies[i],
            bodyB: cell.bodies[j]
          });
        }
      }
    }

    return pairs
  }

}



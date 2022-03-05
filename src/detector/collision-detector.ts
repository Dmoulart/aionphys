import { Collision } from 'aionsat';
import { Body } from '../body';

/**
 * A collision detector performs collision detection between two bodies.
 * It returns a boolean value indicating whether the bodies are colliding as well as informations about the collision.
 *
 */
export interface CollisionDetectorInterface {
  /**
   * Perform a collision check between two bodies. Returns collision information or false if no collision is detected.
   *
   * @param a bodyA
   * @param b bodyB
   * @returns the collision informations or false if no collision
   */
  intersects(a: Body, b: Body): Collision | false;
}

import { Body } from '../body';
import { BodyPair } from './body-pair';

/**
 * The broadphase is responsible for detecting potential collisions between bodies.
 *
 */
export interface BroadphaseInterface {
  /**
   * Extract the bodies which are susceptible of colliding and returns pairs of bodies.
   *
   * @param bodies
   * @returns pairs of bodies
   */
  pair(bodies: Body[]): BodyPair[];
}

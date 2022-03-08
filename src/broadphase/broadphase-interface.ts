import { Body } from '../body';
import { World } from '../world';
import { BodyPair } from './body-pair';

/**
 * The broadphase is responsible for detecting potential collisions between bodies.
 *
 */
export interface BroadphaseInterface {

  /**
   * Takes a reference to the simulation world.
   * 
   */
  world: World

  /**
   * Extract the bodies which are susceptible of colliding and returns pairs of bodies.
   *
   * @param bodies
   * @returns pairs of bodies
   */
  pair(bodies: Body[]): BodyPair[];
}

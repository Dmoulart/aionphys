import { Body } from '../body';

/**
 * A pair of body.
 * Used by the broadphase to track potential collision pairs.
 */
export type BodyPair = {
  bodyA: Body;
  bodyB: Body;
};

import { Body } from "../body";

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
    extract(bodies: Body[]): Body[];
}
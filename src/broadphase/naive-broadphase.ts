import { Body } from "../body";
import { BroadphaseInterface } from "./broadphase-interface";

/**
 * A really naive broadphase implementation.
 * 
 */
export class NaiveBroadphase implements BroadphaseInterface {

    /**
     * @inheritdoc
     */
    public extract(bodies: Body[]): Body[] {
        return bodies;
    }
}
import { Body } from "./body";
import { NaiveBroadphase } from "./broadphase";
import { BroadphaseInterface } from "./broadphase/broadphase-interface";

export type WorldOptions = {
    bodies: Body[];
    broadphase?: BroadphaseInterface;
}

/**
 * The world is the container for all physics bodies in the simulation.
 * It also orchestrate the collision detection and resolution.
 *
 */
export class World {
    /**
     * The world's bodies.
     * 
     */
    private _bodies: Body[] = [];

    /**
     * The broadphase implementation. Its role is to extract pairs of bodies which are potentially colliding.
     * 
     */
    private _broadphase!: BroadphaseInterface;


    public constructor(options: WorldOptions) {
        const { bodies, broadphase } = options;
        this.bodies = bodies;
        this.broadphase = broadphase ?? new NaiveBroadphase();
    }

    /**
     * Update the world bodies positions by performing collision detections and resolution.
     * 
     * @returns nothing
     */
    public step(): void {
        this.moveBodies()
        const pairs = this.broadphase.extract(this.bodies);
    }

    /**
     * Update all the bodies positions.
     * 
     * @returns nothing
     */
    private moveBodies(): void {
        const len = this.bodies.length;
        for (let i = 0; i < len; i++) {
            this.moveBody(this.bodies[i]);
        }
    }

    /**
     * Update the body's position.
     * 
     * @param body 
     * @returns nothing
     */
    private moveBody(body: Body): void {
        body.pos = body.pos.add(body.vel);
    }

    /**
     * The world's bodies.
     * 
     * @returns bodies
     */
    public get bodies(): Body[] {
        return this._bodies;
    }

    /**
     * Set the world's bodies.
     * 
     * @param bodies
     */
    public set bodies(bodies: Body[]) {
        this._bodies = bodies;
    }

    /**
     * The world's broadphase detection implementation.
     * 
     * @returns world's broadphase instance 
     */
    public get broadphase(): BroadphaseInterface {
        return this._broadphase;
    }

    /**
     * Set the world's broadphase detection implementation.
     * 
     * @param broadphase
     */
    public set broadphase(broadphase: BroadphaseInterface) {
        this._broadphase = broadphase;
    }

}
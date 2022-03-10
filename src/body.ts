import { Circle, Shape, Vector } from 'aionsat';
import { BodyBehaviors } from './body-behavior';
import { AABB } from './math/aabb';

/**
 * The body initialization object type.
 *
 */
export type BodyOptions = {
  shape?: Shape;

  pos?: Vector;

  vel?: Vector;

  behavior?: BodyBehaviors;

  data?: Record<string, any>
};

/**
 * The body class represents a material object in the simulation.
 *
 */
export class Body {
  /**
   * All the possible bodies behaviors.
   *
   */
  public static Behaviors = BodyBehaviors;

  /**
   * The geometry of the body.
   *
   */
  private _shape!: Shape;

  /**
   * The velocity of the body.
   *
   */
  private _vel!: Vector;

  /**
   * The body's step velocity is used to conserve the body's velocity during a simulation step.
   * It allow us to mutate the body's velocity during the step without losing the original starting value.
   * This original starting value is used to calculate the translations values which we divide with the world's 
   * setted iteration number.
   * 
   * It must only be set in the world at the beginning of a world simulation step.
   * 
   */
  private _stepVel!: Vector;

  /**
   * The body's behavior.
   *
   */
  private _behavior!: BodyBehaviors;

  /**
   * Data of any form can be attached to the body.
   * It is used for debug purposed.
   */
  private _data!: Record<string, any>;

  /**
   * Initialize a new body. Use the body options or use the default options.
   * 
   * @param options the body initialization object
   */
  constructor(options: BodyOptions) {
    const { shape, pos, vel, behavior, data } = options;
    this.shape = shape ?? new Circle(10);
    this.pos = pos ?? new Vector(0, 0);
    this.vel = vel ?? new Vector(0, 0);
    this.behavior = behavior ?? BodyBehaviors.Dynamic;
    this.data = data ?? {}
  }

  /**
   * Get the body's axis aligned bounding box.
   * 
   */
  aabb() {
    return AABB.from(this.shape)
  }

  /**
   * The body position in the simulation.
   *
   * @return shape position
   */
  get pos(): Vector {
    return this.shape.pos;
  }

  /**
   * Set the body position.
   *
   * @param pos the body position
   */
  set pos(pos: Vector) {
    this.shape.pos = pos;
  }

  /**
   * The body's velocity.
   *
   * @return body shape
   */
  get vel(): Vector {
    return this._vel;
  }

  /**
   * Set the body's velocity.
   *
   * @param vel the body velocity
   */
  set vel(vel: Vector) {
    this._vel = vel;
  }

  /**
   * Set the body's step velocity.
   * 
   * @returns body step velocity
   */
  public get stepVel(): Vector {
    return this._stepVel;
  }

  /**
   * Get the body's step velocity.
   * It must only be set in the world at the beginning of a world simulation step.
   * 
   * @param stepVel the body step velocity
   */
  public set stepVel(stepVel: Vector) {
    this._stepVel = stepVel;
  }

  /**
   * The body geometrical entity.
   *
   * @return body shape
   */
  get shape(): Shape {
    return this._shape;
  }

  /**
   * Set the body geometrical entity.
   * 
   * @param shape the body shape
   */
  set shape(shape: Shape) {
    this._shape = shape;
  }

  /**
   * The body behavior.
   *
   * @returns body behavior
   */
  get behavior(): BodyBehaviors {
    return this._behavior;
  }

  /**
   * Set the body behavior.
   *
   * @param behavior the body behavior
   */
  set behavior(behavior: BodyBehaviors) {
    this._behavior = behavior;
  }

  /**
   * Returns true if a body's behavior is dynamic.
   *
   * @returns body is dynamic
   */
  get isDynamic(): boolean {
    return this.behavior === BodyBehaviors.Dynamic;
  }

  /**
   * Returns true if a body's behavior is static.
   *
   * @returns body is static
   */
  get isStatic(): boolean {
    return this.behavior === BodyBehaviors.Static;
  }

  /**
   * Get the body data.
   * 
   * @returns body data
   */
  public get data(): Record<string, any> {
    return this._data;
  }

  /**
   * Set the body data.
   * 
   * @param data
   */
  public set data(data: Record<string, any>) {
    this._data = data;
  }
}

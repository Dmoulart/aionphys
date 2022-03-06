import { Circle, Shape, Vector } from 'aionsat';
import { BodyBehaviors } from './body-behavior';

/**
 * The body initialization object type.
 * 
 */
export type BodyOptions = {
  shape?: Shape;
  pos?: Vector;
  vel?: Vector;
  behavior?: BodyBehaviors;
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
   * The geometry of the body.
   *
   */
  private _vel!: Vector;

  /**
   * The body behavior.
   * 
   */
  private _behavior!: BodyBehaviors;

  constructor(options: BodyOptions) {
    const { shape, pos, vel, behavior } = options;
    this.shape = shape ?? new Circle(10);
    this.pos = pos ?? new Vector(0, 0);
    this.vel = vel ?? new Vector(0, 0);
    this.behavior = behavior ?? BodyBehaviors.Dynamic;
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
   */
  set pos(vector: Vector) {
    this.shape.pos = vector;
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
   */
  set vel(vel: Vector) {
    this._vel = vel;
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
   */
  set behavior(behavior: BodyBehaviors) {
    this._behavior = behavior;
  }

  /**
   * Returns true if a body is dynamic.
   * 
   */
  get isDynamic(): boolean {
    return this.behavior === BodyBehaviors.Dynamic;
  }

  /**
   * Returns true if a body is static.
   * 
   */
  get isStatic(): boolean {
    return this.behavior === BodyBehaviors.Static;
  }
}

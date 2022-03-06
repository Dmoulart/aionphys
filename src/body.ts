import { Circle, Shape, Vector } from 'aionsat';

export type BodyOptions = {
  shape?: Shape;
  pos?: Vector;
  vel?: Vector;
};
/**
 * The body class represents a material object in the simulation.
 *
 */
export class Body {
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

  constructor(options: BodyOptions) {
    const { shape, pos, vel } = options;
    this.shape = shape ?? new Circle(10);
    this.pos = pos ?? new Vector(0, 0);
    this.vel = vel ?? new Vector(0, 0);
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
}

import { Collision, Sat } from 'aionsat';
import { Body } from '..';
import { CollisionDetectorInterface } from './collision-detector';

/**
 * The sat detector uses separating axis theorem to detect and analyze the collision between two bodies.
 *
 */
export class SatDetector implements CollisionDetectorInterface {
  /**
   * The sat algorithm implementation.
   */
  private _sat!: Sat;

  /**
   * @inheritdoc
   */
  public intersects(a: Body, b: Body): false | Collision {
    return this.sat.intersects(a.shape, b.shape);
  }

  /**
   * Returns the sat algorithm implementation.
   *
   * @returns SAT
   */
  public get sat(): Sat {
    if (!this._sat) {
      this.sat = new Sat();
    }
    return this._sat;
  }

  /**
   * Set the sat algorithm implementation.
   *
   * @returns SAT
   */
  public set sat(sat: Sat) {
    this._sat = sat;
  }
}

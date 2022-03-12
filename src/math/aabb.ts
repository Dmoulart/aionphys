import { Box, Circle, Polygon, Shape, Vector } from "aionsat";

/**
 * The Axis Aligned Bounding Box (AABB) is a 2D rectangle that approximate a body's shape.
 * 
 */
export class AABB {
    /**
     * The minimum point of the AABB.
     */
    private _min!: Vector;

    /**
     * The maximum point of the AABB.
     */
    private _max!: Vector;


    constructor(min: Vector, max: Vector) {
        this.min = min;
        this.max = max;
    }

    /**
     * Get the minimum point of the AABB.
     * 
     * @returns the minimum point of the AABB
     */
    public get min(): Vector {
        return this._min;
    }

    /**
     * Set the minimum point of the AABB.
     * 
     * @param value the minimum point of the AABB
     */
    public set min(value: Vector) {
        this._min = value;
    }

    /**
     * Get the maximum point of the AABB.
     * 
     * @returns the maximum point of the AABB
     */
    public get max(): Vector {
        return this._max;
    }

    /**
     * Set the maximum point of the AABB.
     * 
     * @param value the maximum point of the AABB
     */
    public set max(value: Vector) {
        this._max = value;
    }

    /**
     * Returns true if it collides with another AABB.
     * 
     * @param other 
     * @returns intersects other axis aligned bounding box
     */
    public intersects(other: AABB): boolean {
        return !(
            this.min.x > other.max.x ||
            this.max.x < other.min.x ||
            this.min.y > other.max.y ||
            this.max.y < other.min.y
        );
    }

    /**
     * Merge two bounding boxes into one.
     * 
     * @param other other boundy box
     * @returns merged bounding box
     */
    public union(other: AABB): AABB {
        const min = new Vector(
            Math.min(this.min.x, other.min.x),
            Math.min(this.min.y, other.min.y)
        )
        const max = new Vector(
            Math.max(this.max.x, other.max.x),
            Math.max(this.max.y, other.max.y)
        )
        return new AABB(min, max);
    }

    /**
     * Get the area of the bounding box.
     * 
     * @return area of the bounding box
     */
    public get area(): number {
        const distance = this.max.sub(this.min);
        return 2 * (distance.x * distance.y);
    }

    /**
     * Generate a new axis aligned bounding box from a body.
     * 
     * @param shape 
     * @returns axis aligned bounding box
     */
    public static from(shape: Shape): AABB {
        if (shape instanceof Circle) {
            return AABB.fromCircle(shape);
        } else if (shape instanceof Polygon) {
            return AABB.fromPolygon(shape);
        } else if (shape instanceof Box) {
            return AABB.fromBox(shape);
        }
        throw new Error(
            `Trying to create an axis-aligned-bounding box for a non supported shape type: ${(shape as any).constructor.name}`
        );
    }

    /**
     * Create a new axis aligned bounding box from a circle.
     * 
     * @param circle 
     * @returns axis aligned bounding box
     */
    private static fromCircle(circle: Circle): AABB {
        const radius = new Vector(circle.radius, circle.radius);

        const min = circle.pos.sub(radius);
        const max = circle.pos.add(radius);

        return new AABB(min, max);;
    }

    /**
     * Create a new axis aligned bounding box from a polygon.
     * 
     * @param polygon 
     * @returns axis aligned bounding box
     */
    private static fromPolygon(polygon: Polygon | Box): AABB {
        const min = new Vector(Number.MAX_VALUE, Number.MAX_VALUE);
        const max = new Vector(Number.MIN_VALUE, Number.MIN_VALUE);

        const vertices = polygon.vertices;
        for (let i = 0; i < vertices.length; i++) {
            const point = vertices[i];

            min.x = Math.min(min.x, point.x);
            min.y = Math.min(min.y, point.y);

            max.x = Math.max(max.x, point.x);
            max.y = Math.max(max.y, point.y);
        }
        return new AABB(min, max);
    }

    /**
     * Create a new axis aligned bounding box from a box.
     * 
     * @param box 
     * @returns axis aligned bounding box
     */
    static fromBox(box: Box): AABB {
        const vertices = box.vertices
        // Get the second and fourth vertex of the box
        const [, min, , max] = vertices

        return new AABB(min, max);
    }
}
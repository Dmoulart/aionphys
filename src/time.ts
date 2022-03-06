export class Time {
    /**
     * The iteration delta time.
     * 
     */
    private static _dt: number = 0;

    /**
     * The last frame timestamp.
     * 
     */
    private static _lastFrameTime: number | null = null;

    /**
   * The world's step delta time.
   * 
   * @returns world's step delta time
   */
    public static get dt(): number {
        return this._dt / 1000;
    }

    /**
     * Set the world delta time.
     * 
     * @param dt the world delta time
     */
    public static set dt(dt: number) {
        this._dt = dt;
    }

    /**
     * The world's last frame timestamp.
     * 
     * @returns world's last frame timestamp
     */
    public static get lastFrameTime(): number {
        return this._lastFrameTime ?? performance.now();
    }

    /**
     * Set the world's last frame timestamp.
     * 
     * @param lastFrameTime the world last frame timestamp
     */
    public static set lastFrameTime(lastFrameTime: number) {
        this._lastFrameTime = lastFrameTime;
    }

    /**
     * The global time in milliseconds.
     * 
     * @returns the global time in milliseconds
     */
    public static get now() {
        return performance.now();
    }

}
export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export const center = (position, width, height) => {
    return new Point(position.x - width / 2, position.y - height / 2);
};

export const assert = (cond, msg) => {
    if (!cond) {
        throw msg;
    }
};

export const sqr = x => x * x;
export const insideCircle = (center, rad, point) => sqr(point.x - center.x) + sqr(point.y - center.y) <= sqr(rad);
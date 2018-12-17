export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    relativeTo(point) {
        return new Point(this.x - point.x, this.y - point.y);
    }

    scaleFactorPoint(xVal, yVal) {
        return new Point(this.x / xVal, this.y / yVal);
    }

    valuePoint(xVal, yVal) {
        return new Point(this.x * xVal, this.y * yVal);
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
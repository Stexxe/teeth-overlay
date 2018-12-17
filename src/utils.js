export class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export const toLocalPoint = (el, globalPoint) => {
    const absPosition = el.getBoundingClientRect();
    return new Point(globalPoint.x - absPosition.x, globalPoint.y - absPosition.y);
};

export const center = (position, width, height) => {
    return new Point(position.x - width / 2, position.y - height / 2);
};

export type Point = [number, number];

export const relative = ([ox, oy]: Point, [tx, ty]: Point): Point => {
    return [tx - ox, ty - oy];
};

export const equal = ([x1, y1]: Point, [x2, y2]: Point): boolean => {
    return (x1 === x2 && y1 === y2);
};

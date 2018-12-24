import {Point, relative} from "./Point";

export function append<T>(arr: T[], item: T): T[] {
    const result = arr.slice();
    result.push(item);
    return result;
}

export function remove<T>(arr: T[], index: number): T[] {
    const result = arr.slice();
    result.splice(index, 1);
    return result;
}

export function localMousePosition(event: MouseEvent, element: HTMLElement): Point {
    const rect = element.getBoundingClientRect();
    return relative([rect.left, rect.top], [event.clientX, event.clientY]);
}

export type Dimension = [number, number];
export type Rect = [number, number, number, number];

export const center = ([x, y]: Point, [width, height]: Dimension) => [x - width / 2, y - height / 2];
